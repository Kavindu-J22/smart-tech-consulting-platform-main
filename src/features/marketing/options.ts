// Marketing Strategy Assessment options and fixed choice lists (Q1–Q21 from Proposal Appendix 1)
// Stored ids are lowercase snake_case or standard identifiers. Never rename an id once stored in DB.

export const MARKETING_INDUSTRIES = [
  "saas",
  "fintech",
  "ecommerce",
  "healthtech",
  "edtech",
  "ai_ml",
  "cybersecurity",
  "other",
] as const;

export const MARKETING_INDUSTRY_LABELS: Record<string, string> = {
  saas: "Software / SaaS",
  fintech: "FinTech",
  ecommerce: "E-commerce",
  healthtech: "Healthcare Technology",
  edtech: "Education Technology",
  ai_ml: "Artificial Intelligence",
  cybersecurity: "Cybersecurity",
  other: "Other",
};

export const MARKET_TYPES = ["b2b", "b2c", "both"] as const;

export const MARKET_TYPE_LABELS: Record<string, string> = {
  b2b: "B2B (Business to Business)",
  b2c: "B2C (Business to Consumer)",
  both: "Both B2B and B2C",
};

export const AGE_GROUPS = [
  "age_18_24",
  "age_25_34",
  "age_35_44",
  "age_45_54",
  "age_55_plus",
  "multiple",
] as const;

export const AGE_GROUP_LABELS: Record<string, string> = {
  age_18_24: "18–24 years",
  age_25_34: "25–34 years",
  age_35_44: "35–44 years",
  age_45_54: "45–54 years",
  age_55_plus: "55+ years",
  multiple: "Multiple age groups",
};

export const CUSTOMER_ROLES = [
  "business_owner",
  "it_professional",
  "student",
  "manager",
  "accountant",
  "general_consumer",
  "other",
] as const;

export const CUSTOMER_ROLE_LABELS: Record<string, string> = {
  business_owner: "Business owner / Founder",
  it_professional: "IT professional / Software engineer",
  student: "Student / Academic",
  manager: "Manager / Department lead",
  accountant: "Accountant / Finance executive",
  general_consumer: "General consumer",
  other: "Other specialized professional",
};

export const AUDIENCE_LOCATIONS = [
  "all_island",
  "western_province",
  "central_province",
  "southern_province",
  "northern_province",
  "eastern_province",
  "other_provinces",
] as const;

export const AUDIENCE_LOCATION_LABELS: Record<string, string> = {
  all_island: "All Sri Lanka (Islandwide)",
  western_province: "Western Province (Colombo, Gampaha, Kalutara)",
  central_province: "Central Province (Kandy, Matale, Nuwara Eliya)",
  southern_province: "Southern Province (Galle, Matara, Hambantota)",
  northern_province: "Northern Province (Jaffna, Kilinochchi, etc.)",
  eastern_province: "Eastern Province (Trincomalee, Batticaloa, Ampara)",
  other_provinces: "Other provincial / regional areas",
};

// 1-5 scales for technical literacy analysis
export const TECH_COMFORT_LEVELS = [
  "comfort_1",
  "comfort_2",
  "comfort_3",
  "comfort_4",
  "comfort_5",
] as const;

export const TECH_COMFORT_LABELS: Record<string, string> = {
  comfort_1: "1 - Very low (Generally uncomfortable with digital technology)",
  comfort_2: "2 - Low (Can use basic apps but struggles with technical interfaces)",
  comfort_3: "3 - Medium (Comfortable with common digital tools and SaaS)",
  comfort_4: "4 - High (Familiar with advanced digital workflows and software)",
  comfort_5: "5 - Very high (Highly technical, developers, engineers, power users)",
};

export const TECH_TERMS_FAMILIARITY = [
  "terms_1",
  "terms_2",
  "terms_3",
  "terms_4",
  "terms_5",
] as const;

export const TECH_TERMS_LABELS: Record<string, string> = {
  terms_1: "1 - Not familiar at all (Plain language only)",
  terms_2: "2 - Slightly familiar (Recognizes broad terms like cloud, app)",
  terms_3: "3 - Moderately familiar (Understands API, CRM, database, automation)",
  terms_4: "4 - Very familiar (Comfortable with architecture, SaaS tiers, integration)",
  terms_5: "5 - Highly familiar (In-depth domain & engineering terminology)",
};

export const MESSAGE_DETAIL_PREFERENCES = [
  "detail_1",
  "detail_2",
  "detail_3",
  "detail_4",
  "detail_5",
] as const;

export const MESSAGE_DETAIL_LABELS: Record<string, string> = {
  detail_1: "Very simple, outcome-based non-technical language",
  detail_2: "Mostly simple language with clear visual analogies",
  detail_3: "Balanced technical and practical operational workflow language",
  detail_4: "Detailed technical language with architectural capabilities",
  detail_5: "Highly technical, specifications and engineering-grade copy",
};

export const CUSTOMER_PAIN_POINTS = [
  "saves_time",
  "reduces_costs",
  "improves_efficiency",
  "reduces_errors",
  "improves_security",
  "makes_work_easier",
  "better_customer_experience",
] as const;

export const CUSTOMER_PAIN_POINT_LABELS: Record<string, string> = {
  saves_time: "Saves time on daily tasks",
  reduces_costs: "Reduces operational and labor costs",
  improves_efficiency: "Improves team and workflow efficiency",
  reduces_errors: "Reduces human errors and compliance slips",
  improves_security: "Improves data security and privacy",
  makes_work_easier: "Makes complex work easier to execute",
  better_customer_experience: "Provides a faster, superior customer experience",
};

export const MARKETING_CHANNELS = [
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "youtube",
  "google_ads",
  "email_marketing",
  "website_seo",
] as const;

export const MARKETING_CHANNEL_LABELS: Record<string, string> = {
  facebook: "Facebook (Broad Reach, B2C/SME Community)",
  instagram: "Instagram (Visual Lifestyle, Product Demos)",
  linkedin: "LinkedIn (B2B, Corporate Decision-Makers)",
  tiktok: "TikTok (Short-form Video, Gen-Z / Youth)",
  youtube: "YouTube (Long-form Explainer & Educational Video)",
  google_ads: "Google Search Ads (High-intent Buyers)",
  email_marketing: "Email Marketing (Lifecycle Retention & B2B)",
  website_seo: "Website & SEO (Organic Discoverability & Trust)",
};

export const CONTENT_TYPES = [
  "short_videos",
  "educational_videos",
  "images_graphics",
  "articles_blogs",
  "case_studies",
  "product_demos",
  "customer_testimonials",
] as const;

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  short_videos: "Short videos (Reels, Shorts, TikTok)",
  educational_videos: "Educational / explainer videos",
  images_graphics: "Infographics, carousels & graphic posts",
  articles_blogs: "In-depth articles & technical blog posts",
  case_studies: "Customer case studies & ROI reports",
  product_demos: "Guided product demonstrations & walk-throughs",
  customer_testimonials: "Customer reviews & social proof testimonials",
};

export const BUDGET_FLEXIBILITIES = [
  "fixed",
  "slightly_flexible",
  "moderately_flexible",
  "highly_flexible",
] as const;

export const BUDGET_FLEXIBILITY_LABELS: Record<string, string> = {
  fixed: "Fixed budget (Strict monthly cap)",
  slightly_flexible: "Slightly flexible (±10% rebalancing)",
  moderately_flexible: "Moderately flexible (±25% channel rebalancing)",
  highly_flexible: "Highly flexible (Aggressive reallocation to top channel)",
};

export const CAMPAIGN_DURATIONS = [
  "duration_1m",
  "duration_3m",
  "duration_6m",
  "duration_12m",
] as const;

export const CAMPAIGN_DURATION_LABELS: Record<string, string> = {
  duration_1m: "1 month (Short sprint / pilot test)",
  duration_3m: "3 months (Standard initial campaign)",
  duration_6m: "6 months (Growth & scaling phase)",
  duration_12m: "12 months (Annual marketing plan)",
};

export const CAMPAIGN_DURATION_MONTHS: Record<string, number> = {
  duration_1m: 1,
  duration_3m: 3,
  duration_6m: 6,
  duration_12m: 12,
};

export const CAMPAIGN_GOALS = [
  "website_visitors",
  "leads",
  "sales",
  "social_engagement",
  "brand_awareness",
] as const;

export const CAMPAIGN_GOAL_LABELS: Record<string, string> = {
  website_visitors: "Drive website visitors & web traffic",
  leads: "Generate qualified B2B leads & inquiries",
  sales: "Acquire paying customers & direct sales",
  social_engagement: "Grow social media engagement & community",
  brand_awareness: "Build market brand awareness & recognition",
};

// Analytical Hierarchy Process (AHP) Criteria definitions
export const AHP_CRITERIA = [
  "audience_fit",
  "objective_fit",
  "cost_suitability",
  "reach_fit",
  "content_fit",
] as const;

export const AHP_CRITERIA_LABELS: Record<string, string> = {
  audience_fit: "Audience Fit (B2B/B2C, Persona, Demographics)",
  objective_fit: "Campaign Objective Fit (Leads, Sales, Awareness)",
  cost_suitability: "Cost Suitability & Affordability (CPC/CPM vs Budget)",
  reach_fit: "Sri Lankan Market Reach (Platform penetration)",
  content_fit: "Content Alignment (Video, Article, Visual compatibility)",
};

export const DEFAULT_AHP_WEIGHTS: Record<string, number> = {
  audience_fit: 0.34,
  objective_fit: 0.25,
  cost_suitability: 0.18,
  reach_fit: 0.13,
  content_fit: 0.1,
};

// Standard Saaty Random Index (RI) lookup table
export const SAATY_RANDOM_INDEX: Record<number, number> = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export const LITERACY_TIERS = ["low", "medium", "high"] as const;

export const LITERACY_TIER_LABELS: Record<string, string> = {
  low: "Low Technical Literacy",
  medium: "Medium Technical Literacy",
  high: "High Technical Literacy",
};
