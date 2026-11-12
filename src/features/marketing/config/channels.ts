// Sri Lankan Marketing Channel Catalog & Baseline Context
// Sources: DataReportal Digital 2026 Sri Lanka, ICTA National Digital Strategy 2030, EDB Industry Overviews

export interface ChannelProfile {
  id: string;
  name: string;
  sriLankaReachRate: number; // 0.0 to 1.0 (estimated digital population reach)
  relativeCostIndex: number; // 0.0 to 1.0 (higher = cheaper/more accessible for small budgets)
  minViableMonthlyLkr: number;
  marketAffinity: {
    b2b: number;
    b2c: number;
    both: number;
  };
  literacyAffinity: {
    low: number;
    medium: number;
    high: number;
  };
  supportedContent: string[];
  evidenceNotes: string[];
}

export const CHANNEL_PROFILES: Record<string, ChannelProfile> = {
  facebook: {
    id: "facebook",
    name: "Facebook",
    sriLankaReachRate: 0.87,
    relativeCostIndex: 0.75,
    minViableMonthlyLkr: 5000,
    marketAffinity: { b2b: 0.65, b2c: 0.92, both: 0.82 },
    literacyAffinity: { low: 0.92, medium: 0.85, high: 0.7 },
    supportedContent: ["short_videos", "images_graphics", "customer_testimonials"],
    evidenceNotes: [
      "Broadest domestic consumer reach (~87% Sri Lankan social media population).",
      "High local language (Sinhala/Tamil/English) adoption across provincial SMEs.",
    ],
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    sriLankaReachRate: 0.62,
    relativeCostIndex: 0.72,
    minViableMonthlyLkr: 5000,
    marketAffinity: { b2b: 0.45, b2c: 0.9, both: 0.7 },
    literacyAffinity: { low: 0.85, medium: 0.88, high: 0.75 },
    supportedContent: ["short_videos", "images_graphics", "product_demos"],
    evidenceNotes: [
      "Strongest engagement among urban and tech-forward demographics aged 18–34.",
      "High conversion for visual SaaS, e-commerce, and direct consumer lifestyle apps.",
    ],
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    sriLankaReachRate: 0.35,
    relativeCostIndex: 0.4,
    minViableMonthlyLkr: 15000,
    marketAffinity: { b2b: 0.95, b2c: 0.32, both: 0.75 },
    literacyAffinity: { low: 0.45, medium: 0.85, high: 0.98 },
    supportedContent: ["articles_blogs", "case_studies", "educational_videos"],
    evidenceNotes: [
      "Unmatched B2B targeting for Colombo and regional executive and IT leadership.",
      "Higher CPC requires focused value proposition and qualified enterprise lead capture.",
    ],
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    sriLankaReachRate: 0.48,
    relativeCostIndex: 0.85,
    minViableMonthlyLkr: 5000,
    marketAffinity: { b2b: 0.3, b2c: 0.88, both: 0.6 },
    literacyAffinity: { low: 0.95, medium: 0.8, high: 0.55 },
    supportedContent: ["short_videos"],
    evidenceNotes: [
      "Rapidly expanding viral reach among youth and student demographics in Sri Lanka.",
      "Best suited for casual consumer digital products and viral app downloads.",
    ],
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    sriLankaReachRate: 0.78,
    relativeCostIndex: 0.65,
    minViableMonthlyLkr: 10000,
    marketAffinity: { b2b: 0.75, b2c: 0.82, both: 0.82 },
    literacyAffinity: { low: 0.88, medium: 0.9, high: 0.85 },
    supportedContent: ["educational_videos", "product_demos", "case_studies"],
    evidenceNotes: [
      "Second highest search engine in Sri Lanka; ideal for guided product walkthroughs.",
      "High retention for technical tutorials and customer education across provinces.",
    ],
  },
  google_ads: {
    id: "google_ads",
    name: "Google Ads (Search)",
    sriLankaReachRate: 0.85,
    relativeCostIndex: 0.45,
    minViableMonthlyLkr: 15000,
    marketAffinity: { b2b: 0.88, b2c: 0.82, both: 0.86 },
    literacyAffinity: { low: 0.75, medium: 0.88, high: 0.92 },
    supportedContent: ["articles_blogs", "product_demos"],
    evidenceNotes: [
      "Captures immediate high-intent buyers actively searching for software solutions.",
      "Direct conversion for competitive FinTech, SaaS, and eCommerce search queries.",
    ],
  },
  email_marketing: {
    id: "email_marketing",
    name: "Email Marketing",
    sriLankaReachRate: 0.5,
    relativeCostIndex: 0.95,
    minViableMonthlyLkr: 0,
    marketAffinity: { b2b: 0.88, b2c: 0.58, both: 0.74 },
    literacyAffinity: { low: 0.6, medium: 0.85, high: 0.95 },
    supportedContent: ["articles_blogs", "case_studies", "product_demos"],
    evidenceNotes: [
      "Lowest marginal cost channel; essential for SaaS free-trial to paid onboarding.",
      "High enterprise trustworthiness for corporate communications and updates.",
    ],
  },
  website_seo: {
    id: "website_seo",
    name: "Website & SEO",
    sriLankaReachRate: 0.8,
    relativeCostIndex: 0.9,
    minViableMonthlyLkr: 0,
    marketAffinity: { b2b: 0.92, b2c: 0.75, both: 0.84 },
    literacyAffinity: { low: 0.7, medium: 0.88, high: 0.95 },
    supportedContent: ["articles_blogs", "case_studies", "product_demos"],
    evidenceNotes: [
      "Foundational digital anchor; establishes domain authority and long-term organic discovery.",
      "Zero ad-spend requirement makes it resilient during budget contraction.",
    ],
  },
};
