import {
  ADOPTION_BARRIERS,
  ADOPTION_BARRIER_LABELS,
  BUILD_STAGES,
  BUILD_STAGE_LABELS,
  CHURN_FREQUENCIES,
  CHURN_FREQUENCY_LABELS,
  COMPETITION_LEVELS,
  COMPETITION_LEVEL_LABELS,
  COMPETITOR_PREFERENCES,
  COMPETITOR_PREFERENCE_LABELS,
  CONFIDENCE_LEVELS,
  CONFIDENCE_LEVEL_LABELS,
  CUSTOMER_CONVERSATIONS,
  CUSTOMER_CONVERSATION_LABELS,
  FEEDBACK_SPEEDS,
  FEEDBACK_SPEED_LABELS,
  LAUNCH_CONCERNS,
  LAUNCH_CONCERN_LABELS,
  MARKET_CHANGES,
  MARKET_CHANGE_LABELS,
  PAYMENT_RESEARCH,
  PAYMENT_RESEARCH_LABELS,
  PERFORMANCE_PROBLEMS,
  PERFORMANCE_PROBLEM_LABELS,
  TARGET_CUSTOMERS,
  TARGET_CUSTOMER_LABELS,
  USER_TESTING,
  USER_TESTING_LABELS,
} from "@/features/product/options";
import type { DraftAnswers } from "@/features/product/schema";

// The three questionnaires from the Figma prototype, in order. The form shows one section at a
// time. Each question's id is its field name in schema.ts, so TypeScript catches a typo.

type Question =
  | { id: keyof DraftAnswers; label: string; type: "text" | "short_text" | "number" }
  | {
      id: keyof DraftAnswers;
      label: string;
      type: "choice" | "multi_choice";
      ids: readonly string[];
      labels: Record<string, string>;
    };

type Section = { title: string; questions: Question[] };

type Questionnaire = { title: string; intro: string; sections: Section[] };

export const QUESTIONNAIRES: Record<string, Questionnaire> = {
  proposed: {
    title: "Proposed Product Validation Assessment",
    intro: "Help us understand your idea, customers and market assumptions.",
    sections: [
      {
        title: "Product idea",
        questions: [
          {
            id: "productIdea",
            label: "What product or service are you planning to create?",
            type: "text",
          },
          {
            id: "mainProblem",
            label: "What main problem does your product aim to solve?",
            type: "text",
          },
        ],
      },
      {
        title: "Target customers",
        questions: [
          {
            id: "targetCustomer",
            label: "Who is your main target customer?",
            type: "choice",
            ids: TARGET_CUSTOMERS,
            labels: TARGET_CUSTOMER_LABELS,
          },
          {
            id: "problemConfidence",
            label: "How confident are you that this customer group experiences the problem?",
            type: "choice",
            ids: CONFIDENCE_LEVELS,
            labels: CONFIDENCE_LEVEL_LABELS,
          },
        ],
      },
      {
        title: "Customer need validation",
        questions: [
          {
            id: "customerConversations",
            label: "Have you spoken to potential customers about this problem?",
            type: "choice",
            ids: CUSTOMER_CONVERSATIONS,
            labels: CUSTOMER_CONVERSATION_LABELS,
          },
          {
            id: "customersInterviewed",
            label: "How many potential customers have you interviewed or surveyed?",
            type: "number",
          },
          {
            id: "customerNeed",
            label: "What common customer need did you identify?",
            type: "text",
          },
        ],
      },
      {
        title: "Competition and value",
        questions: [
          {
            id: "competitionLevel",
            label: "Are there existing products that solve the same problem?",
            type: "choice",
            ids: COMPETITION_LEVELS,
            labels: COMPETITION_LEVEL_LABELS,
          },
          {
            id: "differentiation",
            label: "What makes your proposed product different?",
            type: "text",
          },
        ],
      },
      {
        title: "Market and risks",
        questions: [
          {
            id: "paymentResearch",
            label: "Have you researched whether customers are willing to pay for this solution?",
            type: "choice",
            ids: PAYMENT_RESEARCH,
            labels: PAYMENT_RESEARCH_LABELS,
          },
          {
            id: "adoptionBarriers",
            label: "What do you think could prevent customers from using your product?",
            type: "multi_choice",
            ids: ADOPTION_BARRIERS,
            labels: ADOPTION_BARRIER_LABELS,
          },
        ],
      },
    ],
  },

  development: {
    title: "Product Improvement Assessment",
    intro: "Let’s identify what should be improved before your product reaches the market.",
    sections: [
      {
        title: "Current development",
        questions: [
          {
            id: "buildStage",
            label: "What stage of development is your product currently in?",
            type: "choice",
            ids: BUILD_STAGES,
            labels: BUILD_STAGE_LABELS,
          },
          {
            id: "currentFeatures",
            label: "What are the main features currently available?",
            type: "text",
          },
        ],
      },
      {
        title: "User testing",
        questions: [
          {
            id: "userTesting",
            label: "Have real users tested the current product?",
            type: "choice",
            ids: USER_TESTING,
            labels: USER_TESTING_LABELS,
          },
          {
            id: "userFeedback",
            label: "What feedback have users provided so far?",
            type: "text",
          },
        ],
      },
      {
        title: "Feature value",
        questions: [
          {
            id: "bestFeature",
            label: "Which feature receives the most positive feedback?",
            type: "text",
          },
          {
            id: "worstFeature",
            label: "Which feature receives the most negative feedback?",
            type: "text",
          },
          {
            id: "missingFeatures",
            label: "Are there features users requested that are currently missing?",
            type: "text",
          },
        ],
      },
      {
        title: "Customer and market fit",
        questions: [
          {
            id: "solutionConfidence",
            label:
              "How confident are you that the product currently solves the customer’s main problem?",
            type: "choice",
            ids: CONFIDENCE_LEVELS,
            labels: CONFIDENCE_LEVEL_LABELS,
          },
          {
            id: "currentAlternatives",
            label: "What are users currently using instead of your product?",
            type: "text",
          },
        ],
      },
      {
        title: "Improvement priority",
        questions: [
          {
            id: "launchConcern",
            label: "What is currently the biggest concern before launch?",
            type: "choice",
            ids: LAUNCH_CONCERNS,
            labels: LAUNCH_CONCERN_LABELS,
          },
          {
            id: "improvementArea",
            label: "What area would you most like to improve?",
            type: "text",
          },
        ],
      },
    ],
  },

  failed: {
    title: "Product Failure and Performance Assessment",
    intro: "Let’s understand what may have prevented your product from succeeding.",
    sections: [
      {
        title: "Product background",
        questions: [
          {
            id: "launchDate",
            label: "When was your product launched?",
            type: "short_text",
          },
          {
            id: "originalPurpose",
            label: "What was the original purpose of the product?",
            type: "text",
          },
        ],
      },
      {
        title: "Expected vs actual performance",
        questions: [
          {
            id: "expectedUsers",
            label: "How many users did you expect within the first six months?",
            type: "number",
          },
          {
            id: "actualUsers",
            label: "How many users actually used the product?",
            type: "number",
          },
          {
            id: "performanceProblem",
            label: "What was the main performance problem?",
            type: "choice",
            ids: PERFORMANCE_PROBLEMS,
            labels: PERFORMANCE_PROBLEM_LABELS,
          },
        ],
      },
      {
        title: "Customer feedback",
        questions: [
          {
            id: "commonComplaints",
            label: "What were the most common complaints?",
            type: "text",
          },
          {
            id: "churnFrequency",
            label: "Did customers stop using the product after trying it?",
            type: "choice",
            ids: CHURN_FREQUENCIES,
            labels: CHURN_FREQUENCY_LABELS,
          },
        ],
      },
      {
        title: "Product and competition",
        questions: [
          {
            id: "rarelyUsedFeatures",
            label: "Which features were rarely used?",
            type: "text",
          },
          {
            id: "preferredCompetitors",
            label: "Did customers prefer competing products?",
            type: "choice",
            ids: COMPETITOR_PREFERENCES,
            labels: COMPETITOR_PREFERENCE_LABELS,
          },
          {
            id: "competitorReasons",
            label: "Why did customers prefer competitors?",
            type: "text",
          },
        ],
      },
      {
        title: "Market conditions",
        questions: [
          {
            id: "marketChange",
            label: "Did customer needs or market conditions change after development started?",
            type: "choice",
            ids: MARKET_CHANGES,
            labels: MARKET_CHANGE_LABELS,
          },
          {
            id: "feedbackSpeed",
            label: "How quickly did the team respond to customer feedback?",
            type: "choice",
            ids: FEEDBACK_SPEEDS,
            labels: FEEDBACK_SPEED_LABELS,
          },
          {
            id: "failureReason",
            label: "What do you believe was the main reason for poor performance?",
            type: "text",
          },
        ],
      },
    ],
  },
};
