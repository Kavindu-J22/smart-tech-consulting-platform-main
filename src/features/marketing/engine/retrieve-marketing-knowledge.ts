// Ensure server-only execution; bypassed gracefully in standalone unit test runners
if (typeof window !== "undefined") {
  throw new Error("This module can only be executed in a Server environment.");
}
try {
  if (process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("server-only");
  }
} catch {
  // Ignored in non-Next.js standalone test harnesses
}
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import type { MarketingAnswers } from "@/features/marketing/schema";

export const MARKETING_EMBEDDING_MODEL = "text-embedding-3-large";
export const MARKETING_EMBEDDING_DIMENSIONS = 3072;
export const MARKETING_PINECONE_NAMESPACE = "marketing-kalana-v1";
export const MARKETING_TOP_K = 6;

export interface RetrievedEvidence {
  id: string;
  title: string;
  claim: string;
  decisionUse: string;
  sourceTitle: string;
  sourceUrl: string;
  publisher: string;
  observedPeriod: string;
  caveat: string;
  score?: number;
  channelTags?: string[];
  marketTypes?: string[];
  campaignGoals?: string[];
}

export interface RetrievalResult {
  evidence: RetrievedEvidence[];
  source: "pinecone_rag" | "local_dataset_fallback" | "unavailable";
  namespace: string;
  queryText: string;
  disclaimer?: string;
}

interface LocalKnowledgeRow {
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

let cachedLocalRows: LocalKnowledgeRow[] | null = null;

function loadLocalKnowledgeRows(): LocalKnowledgeRow[] {
  if (cachedLocalRows) return cachedLocalRows;
  try {
    const candidates = [
      path.join(process.cwd(), "scripts", "data", "marketing", "marketing_knowledge.jsonl"),
      path.join(process.cwd(), "dataset", "marketing_knowledge.jsonl"),
    ];
    for (const filePath of candidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
          const lines = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf8").split(/\r?\n/).filter(Boolean);
          const rows: LocalKnowledgeRow[] = [];
          for (const line of lines) {
            try {
              rows.push(JSON.parse(line));
            } catch {
              // ignore bad line
            }
          }
          if (rows.length > 0) {
            cachedLocalRows = rows;
            return rows;
          }
        }
      }
    } catch (err) {
      console.error("[Marketing RAG] Error loading local knowledge fallback:", err);
    }
    return [];
  }

/**
 * Fallback retrieval using keyword/channel matching against verified local JSONL records.
 */
    function fallbackLocalRetrieval(answers: MarketingAnswers): RetrievedEvidence[] {
      const rows = loadLocalKnowledgeRows();
      if (!rows.length) return [];

      const marketType = answers.marketType;
      const channels = new Set<string>(answers.channelsCurrentlyUsed || []);
      const goals = new Set<string>(answers.campaignGoals || []);

      // Rank local rows by affinity to current answers
      const scored = rows.map((row) => {
        let score = 0.5; // baseline

        // Market type match
        if (row.market_types.includes(marketType) || row.market_types.includes("both")) {
          score += 0.2;
        }

        // Channel match
        const hasChannelMatch = row.channel_tags.some((tag) => channels.has(tag));
        if (hasChannelMatch) {
          score += 0.25;
        }

        // Campaign goal match
        const hasGoalMatch = row.campaign_goals.some((g) => goals.has(g));
        if (hasGoalMatch) {
          score += 0.15;
        }

        return {
          id: row.id,
          title: row.title,
          claim: row.claim,
          decisionUse: row.decision_use,
          sourceTitle: row.source_title,
          sourceUrl: row.source_url,
          publisher: row.publisher,
          observedPeriod: row.observed_period || "2025/2026",
          caveat: row.evidence_caveat,
          score: Math.min(0.95, Number(score.toFixed(3))),
          channelTags: row.channel_tags,
          marketTypes: row.market_types,
          campaignGoals: row.campaign_goals,
        };
      });

      scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      return scored.slice(0, MARKETING_TOP_K);
    }

    /**
     * Builds a sanitized semantic search query from founder answers without private PII.
     */
    export function buildMarketingSearchQuery(answers: MarketingAnswers): string {
      const parts = [
        `Market: ${(answers.marketType || "b2b").toUpperCase()}`,
        `Target: ${answers.primaryTargetCustomer || ""} (${answers.customerRole || ""})`,
        `Product: ${answers.productName || ""}. Value: ${answers.keyCustomerBenefit || ""}`,
        `Goals: ${(answers.campaignGoals || []).join(", ")}`,
        `Channels: ${(answers.channelsCurrentlyUsed || []).join(", ")}`,
        `Content: ${(answers.preferredContent || []).join(", ")}`,
        `Geography: ${answers.audienceLocation || ""}`,
      ];
      return parts.filter(Boolean).join(". ");
    }

    /**
     * Main runtime RAG retrieval service for the Marketing Assessment module.
     * Strictly queries the 'marketing-kalana-v1' namespace in Pinecone.
     * Falls back gracefully to local dataset if vector service is unreachable or unconfigured.
     */
    export async function retrieveMarketingKnowledge(
      answers: MarketingAnswers,
    ): Promise<RetrievalResult> {
      const queryText = buildMarketingSearchQuery(answers);
      const indexName = process.env.PINECONE_INDEX?.trim();
      const pineconeKey = process.env.PINECONE_API_KEY?.trim();
      const openAiKey = process.env.OPENAI_API_KEY?.trim();

      // If credentials are not configured, use local fallback
      if (!indexName || !pineconeKey || !openAiKey) {
        const fallbackEvidence = fallbackLocalRetrieval(answers);
        return {
          evidence: fallbackEvidence,
          source: fallbackEvidence.length ? "local_dataset_fallback" : "unavailable",
          namespace: MARKETING_PINECONE_NAMESPACE,
          queryText,
          disclaimer: "Vector database credentials not configured; served from verified local market dataset.",
        };
      }

      try {
        const openai = new OpenAI({ apiKey: openAiKey });
        const pinecone = new Pinecone({ apiKey: pineconeKey });
        const index = pinecone.index({
          name: indexName,
          namespace: MARKETING_PINECONE_NAMESPACE,
        });

        // 1. Embed query vector with text-embedding-3-large
        const embeddingResponse = await openai.embeddings.create({
          model: MARKETING_EMBEDDING_MODEL,
          dimensions: MARKETING_EMBEDDING_DIMENSIONS,
          input: queryText,
        });

        const queryVector = embeddingResponse.data[0]?.embedding;
        if (!queryVector || queryVector.length !== MARKETING_EMBEDDING_DIMENSIONS) {
          throw new Error("Invalid embedding vector returned from OpenAI.");
        }

        // 2. Query Pinecone ONLY within the marketing namespace
        const queryResponse = await index.query({
          vector: queryVector,
          topK: MARKETING_TOP_K,
          includeMetadata: true,
        });

        const matches = queryResponse.matches ?? [];
        if (!matches.length) {
          const fallbackEvidence = fallbackLocalRetrieval(answers);
          return {
            evidence: fallbackEvidence,
            source: "local_dataset_fallback",
            namespace: MARKETING_PINECONE_NAMESPACE,
            queryText,
            disclaimer: "Pinecone query returned no direct vector matches; served from local dataset fallback.",
          };
        }

        // 3. Format and validate retrieved evidence
        const evidence: RetrievedEvidence[] = matches
          .filter((m) => m.id && m.id.startsWith("MKT-LK-"))
          .map((m) => {
            const meta = (m.metadata ?? {}) as Record<string, unknown>;
            return {
              id: m.id,
              title: String(meta.title ?? "Marketing Metric"),
              claim: String(meta.claim ?? meta.text ?? ""),
              decisionUse: String(meta.decisionUse ?? ""),
              sourceTitle: String(meta.sourceTitle ?? "Public Source"),
              sourceUrl: String(meta.sourceUrl ?? ""),
              publisher: String(meta.publisher ?? "Verified Publisher"),
              observedPeriod: String(meta.observedPeriod ?? "2025/2026"),
              caveat: String(meta.caveat ?? "General population context; verify for target segment."),
              score: m.score ? Number(m.score.toFixed(4)) : undefined,
              channelTags: Array.isArray(meta.channelTags) ? (meta.channelTags as string[]) : [],
              marketTypes: Array.isArray(meta.marketTypes) ? (meta.marketTypes as string[]) : [],
              campaignGoals: Array.isArray(meta.campaignGoals) ? (meta.campaignGoals as string[]) : [],
            };
          });

        return {
          evidence,
          source: "pinecone_rag",
          namespace: MARKETING_PINECONE_NAMESPACE,
          queryText,
        };
      } catch (error) {
        console.error("[Marketing RAG] Error during Pinecone retrieval:", error);
        // Graceful fallback to verified local dataset so assessment is never blocked
        const fallbackEvidence = fallbackLocalRetrieval(answers);
        return {
          evidence: fallbackEvidence,
          source: fallbackEvidence.length ? "local_dataset_fallback" : "unavailable",
          namespace: MARKETING_PINECONE_NAMESPACE,
          queryText,
          disclaimer: "Pinecone retrieval timed out or encountered network error; served from verified local dataset.",
        };
      }
    }
