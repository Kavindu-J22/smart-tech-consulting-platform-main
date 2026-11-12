// Research Evaluation Utilities: System Usability Scale (SUS) and Classification Metrics
// Supports Section 10 of the Master Implementation Prompt and NFR1-NFR3 validation.

export const SUS_QUESTIONS = [
  "I think that I would like to use this marketing assessment system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system.",
] as const;

export interface SUSScoreResult {
  rawResponses: number[]; // 10 items, 1-5 scale
  susScore: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  adjectiveRating: string;
  isAboveIndustryAverage: boolean; // Benchmark: 68.0
}

/**
 * Calculates standard System Usability Scale (SUS) score (Brooke, 1996).
 * Formula: sum((odd - 1) + (5 - even)) * 2.5
 */
export function calculateSUSScore(responses: number[]): SUSScoreResult {
  if (responses.length !== 10) {
    throw new Error(`SUS requires exactly 10 responses. Received ${responses.length}.`);
  }

  let totalPoints = 0;
  for (let i = 0; i < 10; i++) {
    const val = Math.min(5, Math.max(1, responses[i]));
    if ((i + 1) % 2 === 1) {
      // Odd questions: contribution = score - 1
      totalPoints += val - 1;
    } else {
      // Even questions: contribution = 5 - score
      totalPoints += 5 - val;
    }
  }

  const susScore = Number((totalPoints * 2.5).toFixed(1));

  let grade: "A" | "B" | "C" | "D" | "F" = "F";
  let adjectiveRating = "Poor";

  if (susScore >= 80.3) {
    grade = "A";
    adjectiveRating = "Excellent / Highly Acceptable";
  } else if (susScore >= 68.0) {
    grade = "B";
    adjectiveRating = "Good / Above Average";
  } else if (susScore >= 51.0) {
    grade = "C";
    adjectiveRating = "OK / Marginal";
  } else {
    grade = "D";
    adjectiveRating = "Unacceptable / Cumbersome";
  }

  return {
    rawResponses: responses,
    susScore,
    grade,
    adjectiveRating,
    isAboveIndustryAverage: susScore >= 68.0,
  };
}

export interface ClassificationMetricsResult {
  totalSamples: number;
  accuracy: number;
  perClass: Record<
    string,
    {
      precision: number;
      recall: number;
      f1: number;
      support: number;
    }
  >;
  macroF1: number;
  weightedF1: number;
  confusionMatrix: Record<string, Record<string, number>>;
}

/**
 * Computes multiclass accuracy, per-class precision/recall/F1, macro F1, and confusion matrix.
 */
export function computeClassificationMetrics(
  actual: string[],
  predicted: string[],
  classes = ["low", "medium", "high"],
): ClassificationMetricsResult {
  if (actual.length !== predicted.length || actual.length === 0) {
    throw new Error("Actual and predicted arrays must be non-empty and of equal length.");
  }

  const n = actual.length;
  let correct = 0;

  // Initialize confusion matrix
  const confusionMatrix: Record<string, Record<string, number>> = {};
  for (const c1 of classes) {
    confusionMatrix[c1] = {};
    for (const c2 of classes) {
      confusionMatrix[c1][c2] = 0;
    }
  }

  for (let i = 0; i < n; i++) {
    const act = actual[i];
    const pred = predicted[i];
    if (confusionMatrix[act] && confusionMatrix[act][pred] !== undefined) {
      confusionMatrix[act][pred]++;
    }
    if (act === pred) correct++;
  }

  const accuracy = Number((correct / n).toFixed(4));
  const perClass: Record<
    string,
    { precision: number; recall: number; f1: number; support: number }
  > = {};

  let sumF1 = 0;
  let weightedF1Sum = 0;

  for (const c of classes) {
    const tp = confusionMatrix[c]?.[c] ?? 0;
    let fp = 0;
    let fn = 0;
    let support = 0;

    for (const other of classes) {
      support += confusionMatrix[c]?.[other] ?? 0;
      if (other !== c) {
        fn += confusionMatrix[c]?.[other] ?? 0;
        fp += confusionMatrix[other]?.[c] ?? 0;
      }
    }

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    perClass[c] = {
      precision: Number(precision.toFixed(4)),
      recall: Number(recall.toFixed(4)),
      f1: Number(f1.toFixed(4)),
      support,
    };

    sumF1 += f1;
    weightedF1Sum += f1 * support;
  }

  const macroF1 = Number((sumF1 / classes.length).toFixed(4));
  const weightedF1 = Number((weightedF1Sum / n).toFixed(4));

  return {
    totalSamples: n,
    accuracy,
    perClass,
    macroF1,
    weightedF1,
    confusionMatrix,
  };
}
