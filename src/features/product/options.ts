// Never rename an id: it is stored in the database (ProductAssessment.stage, answers and report).

// The three starting points. Each one has its own questionnaire in config/questions.ts.
export const PRODUCT_STAGES = ["proposed", "development", "failed"] as const;

export const PRODUCT_STAGE_LABELS: Record<string, string> = {
  proposed: "Planned / Proposed Product",
  development: "Product in Development / Needs Improvement",
  failed: "Failed / Underperforming Product",
};

export const PRODUCT_STAGE_TAGS: Record<string, string> = {
  proposed: "Early stage",
  development: "In progress",
  failed: "Post-launch",
};

export const PRODUCT_STAGE_DESCRIPTIONS: Record<string, string> = {
  proposed:
    "I have a product or service idea, but development has not started or the product has not yet been built.",
  development:
    "My product is currently being developed, but I need to validate and improve it before launch.",
  failed:
    "My product has already been developed or launched, but it failed, gained poor adoption, or is performing below expectations.",
};

export const ASSESSMENT_STATUSES = ["draft", "completed"] as const;

export const ASSESSMENT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  completed: "Completed",
};

// Used by more than one questionnaire

export const CONFIDENCE_LEVELS = ["1", "2", "3", "4", "5"] as const;

export const CONFIDENCE_LEVEL_LABELS: Record<string, string> = {
  "1": "1 · Not confident",
  "2": "2 · Slightly confident",
  "3": "3 · Moderately confident",
  "4": "4 · Confident",
  "5": "5 · Very confident",
};

// Planned / proposed product

export const TARGET_CUSTOMERS = [
  "students",
  "young_professionals",
  "smes",
  "large_organizations",
  "general_consumers",
  "other",
] as const;

export const TARGET_CUSTOMER_LABELS: Record<string, string> = {
  students: "Students",
  young_professionals: "Young professionals",
  smes: "SMEs",
  large_organizations: "Large organizations",
  general_consumers: "General consumers",
  other: "Other",
};

export const CUSTOMER_CONVERSATIONS = ["extensively", "a_few", "not_yet"] as const;

export const CUSTOMER_CONVERSATION_LABELS: Record<string, string> = {
  extensively: "Yes, extensively",
  a_few: "Yes, a few customers",
  not_yet: "Not yet",
};

export const COMPETITION_LEVELS = ["many", "a_few", "none_known", "not_researched"] as const;

export const COMPETITION_LEVEL_LABELS: Record<string, string> = {
  many: "Many competitors",
  a_few: "A few competitors",
  none_known: "No known competitors",
  not_researched: "Not researched",
};

export const PAYMENT_RESEARCH = ["yes", "partially", "no"] as const;

export const PAYMENT_RESEARCH_LABELS: Record<string, string> = {
  yes: "Yes",
  partially: "Partially",
  no: "No",
};

export const ADOPTION_BARRIERS = [
  "price",
  "strong_competitors",
  "lack_of_trust",
  "low_awareness",
  "difficult_ux",
  "low_perceived_value",
  "other",
] as const;

export const ADOPTION_BARRIER_LABELS: Record<string, string> = {
  price: "Price",
  strong_competitors: "Strong competitors",
  lack_of_trust: "Lack of customer trust",
  low_awareness: "Low market awareness",
  difficult_ux: "Difficult user experience",
  low_perceived_value: "Customers do not see enough value",
  other: "Other",
};

// Product in development / needs improvement

export const BUILD_STAGES = ["prototype", "mvp", "beta", "nearly_ready"] as const;

export const BUILD_STAGE_LABELS: Record<string, string> = {
  prototype: "Prototype",
  mvp: "MVP",
  beta: "Beta",
  nearly_ready: "Nearly ready for launch",
};

export const USER_TESTING = ["yes", "limited", "no"] as const;

export const USER_TESTING_LABELS: Record<string, string> = {
  yes: "Yes",
  limited: "Limited testing",
  no: "No",
};

export const LAUNCH_CONCERNS = [
  "usability",
  "missing_features",
  "customer_demand",
  "pricing",
  "competition",
  "customer_trust",
  "market_readiness",
] as const;

export const LAUNCH_CONCERN_LABELS: Record<string, string> = {
  usability: "Product usability",
  missing_features: "Missing features",
  customer_demand: "Customer demand",
  pricing: "Pricing",
  competition: "Competition",
  customer_trust: "Customer trust",
  market_readiness: "Market readiness",
};

// Failed / underperforming product

export const PERFORMANCE_PROBLEMS = [
  "low_signups",
  "low_usage",
  "high_churn",
  "poor_sales",
  "negative_feedback",
  "low_engagement",
] as const;

export const PERFORMANCE_PROBLEM_LABELS: Record<string, string> = {
  low_signups: "Low sign-ups",
  low_usage: "Low usage",
  high_churn: "High customer churn",
  poor_sales: "Poor sales",
  negative_feedback: "Negative customer feedback",
  low_engagement: "Low customer engagement",
};

export const CHURN_FREQUENCIES = ["frequently", "sometimes", "rarely", "unknown"] as const;

export const CHURN_FREQUENCY_LABELS: Record<string, string> = {
  frequently: "Frequently",
  sometimes: "Sometimes",
  rarely: "Rarely",
  unknown: "Unknown",
};

export const COMPETITOR_PREFERENCES = ["yes", "no", "unknown"] as const;

export const COMPETITOR_PREFERENCE_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  unknown: "Unknown",
};

export const MARKET_CHANGES = ["significantly", "slightly", "no", "unknown"] as const;

export const MARKET_CHANGE_LABELS: Record<string, string> = {
  significantly: "Significantly",
  slightly: "Slightly",
  no: "No",
  unknown: "Unknown",
};

export const FEEDBACK_SPEEDS = [
  "immediately",
  "within_weeks",
  "after_months",
  "very_rarely",
  "never",
] as const;

export const FEEDBACK_SPEED_LABELS: Record<string, string> = {
  immediately: "Immediately",
  within_weeks: "Within a few weeks",
  after_months: "After several months",
  very_rarely: "Very rarely",
  never: "Never",
};

// The report (written by the AI, checked by ReportSchema)

export const RISK_LEVELS = ["high", "medium", "low"] as const;

export const RISK_LEVEL_LABELS: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const PRIORITIES = ["critical", "high", "medium", "low"] as const;

export const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};
