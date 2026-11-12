// Usage: npx tsx scripts/upload-product-knowledge.ts
// Embeds the Product scenarios and stores them in Pinecone, namespace "product". Safe to run
// again: each vector's id is its scenario_id, so a second run replaces the vectors instead of
// adding copies.
import { readFileSync } from "node:fs";
import { loadEnvConfig } from "@next/env";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import {
  EMBEDDING_DIMENSION,
  EMBEDDING_MODEL,
  PINECONE_NAMESPACE,
} from "@/features/product/config/rag";

loadEnvConfig(process.cwd());

type Scenario = {
  scenario_id: string;
  questionnaire_input: {
    product_concept: string;
    target_audience: string;
    perceived_competitors: string;
    value_proposition: string;
    perceived_challenges: string;
  };
  ground_truth_outputs: Record<string, unknown>;
};

// Only the founder-side inputs are embedded, because a founder's answers are what we search
// with. The outputs ride along in metadata so the report can use them as worked examples.
function inputText(input: Scenario["questionnaire_input"]) {
  return [
    `Product concept: ${input.product_concept}`,
    `Target audience: ${input.target_audience}`,
    `Competitors: ${input.perceived_competitors}`,
    `Value proposition: ${input.value_proposition}`,
    `Challenges: ${input.perceived_challenges}`,
  ].join("\n");
}

// A function because tsx runs this file as CommonJS, which has no top-level await.
async function main() {
  const indexName = process.env.PINECONE_INDEX;
  if (!process.env.OPENAI_API_KEY || !process.env.PINECONE_API_KEY || !indexName) {
    console.error("Set OPENAI_API_KEY, PINECONE_API_KEY and PINECONE_INDEX in .env.local.");
    process.exit(1);
  }

  const scenarios: Scenario[] = JSON.parse(
    readFileSync("scripts/data/product-scenarios.json", "utf8"),
  );
  const texts = scenarios.map((scenario) => inputText(scenario.questionnaire_input));

  const openai = new OpenAI();
  const embeddings = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSION,
    input: texts,
  });

  const index = new Pinecone().index({ name: indexName, namespace: PINECONE_NAMESPACE });
  await index.upsert({
    records: scenarios.map((scenario, i) => ({
      id: scenario.scenario_id,
      values: embeddings.data[i].embedding,
      // Pinecone metadata can't hold nested objects, so the outputs are stored as a JSON string.
      metadata: {
        scenarioId: scenario.scenario_id,
        source: "simulated_scenario",
        inputText: texts[i],
        outputs: JSON.stringify(scenario.ground_truth_outputs),
      },
    })),
  });

  console.log(`Uploaded ${scenarios.length} scenarios to ${indexName} / ${PINECONE_NAMESPACE}.`);
}

main();
