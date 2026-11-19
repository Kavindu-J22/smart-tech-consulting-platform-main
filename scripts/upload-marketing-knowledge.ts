/**
 * Kalana Marketing Knowledge -> Pinecone (marketing namespace only)
 * Copy into the repository as scripts/upload-marketing-knowledge.ts.
 * Copy marketing_knowledge.jsonl into scripts/data/marketing/marketing_knowledge.jsonl.
 *
 * Dry run by default:
 *   npx tsx scripts/upload-marketing-knowledge.ts --dry-run
 * Execute (requires real keys in .env.local):
 *   npx tsx scripts/upload-marketing-knowledge.ts --execute
 * Verify sample semantic retrieval:
 *   npx tsx scripts/upload-marketing-knowledge.ts --verify
 *
 * Does NOT create indexes, delete namespaces, change Product data, or use admin API routes.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

loadEnvConfig(process.cwd());

const MODEL = "text-embedding-3-large";
const DIMENSIONS = 3072;
const NAMESPACE: string = "marketing-kalana-v1";
const DEFAULT_INPUT = "scripts/data/marketing/marketing_knowledge.jsonl";
const args = process.argv.slice(2);
const execute = args.includes("--execute");
const verify = args.includes("--verify");
const dryRun = args.includes("--dry-run") || (!execute && !verify);
const inputArg = args.find((x) => x.startsWith("--input="));
const inputPath = path.resolve(inputArg ? inputArg.split("=").slice(1).join("=") : DEFAULT_INPUT);

interface MarketingKnowledgeRow {
  id: string;
  title: string;
  claim: string;
  decision_use: string;
  source_title: string;
  source_url: string;
  publisher: string;
  source_year: string;
  observed_period: string;
  geo_scope: string;
  channel_tags: string[];
  market_types: string[];
  campaign_goals: string[];
  knowledge_type: string;
  provenance: string;
  verified_on: string;
  evidence_caveat: string;
}

function loadRows(): MarketingKnowledgeRow[] {
  const rows = readFileSync(inputPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line) as MarketingKnowledgeRow;
      } catch {
        throw new Error(`Invalid JSON at line ${index + 1}`);
      }
    });
  if (!rows.length) throw new Error("Knowledge dataset is empty");
  const seen = new Set<string>();
  for (const row of rows) {
    if (!/^MKT-LK-\d{3}$/.test(row.id) || seen.has(row.id)) {
      throw new Error(`Duplicate or invalid marketing record ID: ${row.id}`);
    }
    seen.add(row.id);
    if (!row.title || !row.claim || !row.source_title || !/^https:\/\//.test(row.source_url)) {
      throw new Error(`Missing evidence metadata for record ${row.id}`);
    }
    if (row.provenance !== "public_source_paraphrase") {
      throw new Error(`Unapproved record provenance: ${row.id}`);
    }
  }
  return rows;
}

function embedText(row: MarketingKnowledgeRow): string {
  return [
    `Source-backed Sri Lankan marketing decision-support evidence: ${row.title}`,
    `Evidence: ${row.claim}`,
    `Decision use: ${row.decision_use}`,
    `Applicable channels: ${row.channel_tags.join(", ") || "general"}`,
    `Market types: ${row.market_types.join(", ")}`,
    `Goals: ${row.campaign_goals.join(", ") || "general"}`,
    `Caution: ${row.evidence_caveat}`,
  ].join("\n");
}

async function main() {
  const rows = loadRows();
  console.log(`Validated ${rows.length} marketing knowledge rows from ${inputPath}`);
  console.log(`Target namespace: ${NAMESPACE}; embedding: ${MODEL}; dimensions: ${DIMENSIONS}`);
  console.log(`Record IDs: ${rows[0].id} ... ${rows.at(-1)?.id}`);
  if (dryRun && !execute && !verify) {
    console.log("DRY RUN ONLY: Nothing was sent to OpenAI/Pinecone. Use --execute when ready.");
    return;
  }
  const indexName = process.env.PINECONE_INDEX;
  if (!process.env.OPENAI_API_KEY || !process.env.PINECONE_API_KEY || !indexName) {
    throw new Error("Set OPENAI_API_KEY, PINECONE_API_KEY and PINECONE_INDEX privately in .env.local.");
  }
  if (NAMESPACE === "product" || NAMESPACE === "" || indexName.trim() === "") {
    throw new Error("Unsafe namespace or missing index. Refusing to continue.");
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  // Existing Product module uses the same 3072-dimensional shared index; namespace isolation is required.
  const index = pinecone.index({ name: indexName, namespace: NAMESPACE });

  if (execute) {
    for (let start = 0; start < rows.length; start += 25) {
      const batch = rows.slice(start, start + 25);
      const embedded = await openai.embeddings.create({
        model: MODEL,
        dimensions: DIMENSIONS,
        input: batch.map(embedText),
      });
      if (embedded.data.length !== batch.length) throw new Error("Embedding count mismatch");
      for (const item of embedded.data) {
        if (item.embedding.length !== DIMENSIONS) throw new Error("Wrong embedding vector dimension");
      }
      await index.upsert({
        records: batch.map((row, i) => ({
          id: row.id,
          values: embedded.data[i].embedding,
          metadata: {
            module: "marketing",
            id: row.id,
            title: row.title,
            text: embedText(row),
            claim: row.claim,
            sourceTitle: row.source_title,
            sourceUrl: row.source_url,
            publisher: row.publisher,
            observedPeriod: row.observed_period || "not_specified",
            channelTags: row.channel_tags,
            marketTypes: row.market_types,
            campaignGoals: row.campaign_goals,
            knowledgeType: row.knowledge_type,
            provenance: row.provenance,
            verifiedOn: row.verified_on,
            caveat: row.evidence_caveat,
          },
        }))
      });
      console.log(`Upserted ${Math.min(start + batch.length, rows.length)} / ${rows.length} records`);
    }
  }

  if (execute || verify) {
    const example = rows.find((x) => x.channel_tags.includes("linkedin")) ?? rows[0];
    const sample = await openai.embeddings.create({ model: MODEL, dimensions: DIMENSIONS, input: embedText(example) });
    const result = await index.query({ vector: sample.data[0].embedding, topK: 5, includeMetadata: true });
    const matches = result.matches ?? [];
    console.log("Marketing namespace retrieval matches:", matches.map(m => ({ id: m.id, score: m.score, sourceUrl: m.metadata?.sourceUrl })));
    if (!matches.some(m => m.id === example.id)) {
      throw new Error("Marketing similarity retrieval did not find its expected sample source. Inspect index configuration and namespace.");
    }
    console.log("Verified sampled marketing retrieval. This does not yet verify application-side RAG usage.");
  }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
