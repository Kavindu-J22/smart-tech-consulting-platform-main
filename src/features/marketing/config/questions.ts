// 5-Step Questionnaire Configuration mapping Appendix 1 (Q1–Q21) from the Research Proposal
export interface WizardStep {
  step: number;
  id: string;
  title: string;
  description: string;
  questionIds: string[];
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    step: 1,
    id: "product",
    title: "Product Information",
    description: "Define your product or digital service, core features, and industry (Q1–Q4)",
    questionIds: ["productName", "productDescription", "mainFeatures", "industry"],
  },
  {
    step: 2,
    id: "audience",
    title: "Target Customer",
    description: "Identify target audience demographics, roles, and geography in Sri Lanka (Q5–Q9)",
    questionIds: [
      "primaryTargetCustomer",
      "marketType",
      "ageGroup",
      "customerRole",
      "audienceLocation",
    ],
  },
  {
    step: 3,
    id: "literacy",
    title: "Technical Literacy",
    description: "Assess customer comfort with technology and terminology (Q10–Q12)",
    questionIds: ["techComfort", "techTermsFamiliarity", "messageDetailPreference"],
  },
  {
    step: 4,
    id: "value_channels",
    title: "Value & Channels",
    description: "Detail customer benefits, pain points, active channels, and content (Q13–Q17)",
    questionIds: [
      "keyCustomerBenefit",
      "customerPainPoints",
      "channelsCurrentlyUsed",
      "channelsWorkingBest",
      "preferredContent",
    ],
  },
  {
    step: 5,
    id: "budget_goals",
    title: "Budget & Goals",
    description:
      "Specify monthly budget in LKR, duration, flexibility, and campaign goals (Q18–Q21)",
    questionIds: ["monthlyBudgetLkr", "budgetFlexibility", "campaignDuration", "campaignGoals"],
  },
];
