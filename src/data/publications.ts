export type PublicationKind = "journal" | "conference" | "patent";

export type Publication = {
  id: string;
  kind: PublicationKind;
  title: string;
  /** Ordered author list exactly as published. Empty → `authorsNote` is shown instead. */
  authors: string[];
  authorsNote?: string;
  role: string;
  venue: string;
  publisher?: string;
  /** Omit when not known — never guess. */
  year?: number;
  contribution: string;
  url?: string;
  doi?: string;
};

/** Name to highlight inside author lists. */
export const SELF_AUTHOR = "Abolfazl Malekahmadi";

export const publications: Publication[] = [
  {
    id: "cad-tongue",
    kind: "journal",
    title: "AI-driven tongue image analysis for diagnosing and predicting coronary artery disease",
    authors: [
      "Alireza Hekmat-Ardakani",
      "Hamid R. Rabiee",
      "Armin Behnamnia",
      "Amir Hooman Kazemi",
      "Amir Sobh Rakhshankhah",
      "Ramtin Mahmoudi Kashani",
      "Alireza Yargholi",
      "Bahar Morshed-Behbahani",
      "Abolfazl Malekahmadi",
      "Hamidreza Hekmat",
      "Mehrdad Karimi",
    ],
    role: "Co-author · AI Team Lead",
    venue: "Scientific Reports",
    publisher: "Nature Portfolio",
    year: 2025,
    contribution:
      "Led the AI pipeline for non-invasive CAD diagnosis: SAM segmentation, DeepLabv3+/DINOv2 features and stenosis classification across LAD, RCA and LCX — validated on 906 patients and 12,000 images.",
    url: "https://www.nature.com/articles/s41598-025-28417-4",
    doi: "10.1038/s41598-025-28417-4",
  },
  {
    id: "football-review",
    kind: "journal",
    title:
      "Machine learning models for injury risk prediction in football players: A systematic review of predictors, performance, practical applications, and limitations",
    authors: ["Mehdi Aslani", "Mostafa Zarei", "Zohreh Yaghoubitajani", "Abolfazl Malekahmadi"],
    role: "Co-author",
    venue: "Journal of International Medical Research",
    publisher: "SAGE Publications",
    year: 2026,
    contribution:
      "A systematic review of machine-learning models for football injury-risk prediction: which predictors they use, how well they perform, and where they fall short in practice.",
    url: "https://journals.sagepub.com/doi/full/10.1177/03000605261469442",
    doi: "10.1177/03000605261469442",
  },
  {
    id: "pansam",
    kind: "conference",
    title: "PanSAM: Zero-Shot, Prompt-Free Pancreas Segmentation in CT Imaging",
    authors: [],
    authorsNote: "Abolfazl Malekahmadi (first author) · full author list on OpenReview",
    role: "First author",
    venue: "Foundation Model Workshop, ICML",
    year: 2024,
    contribution:
      "The first prompt-free SAM-based pancreas segmentation: prompts are generated from the model's own probability maps, removing manual input and making the prompting interpretable.",
    url: "https://openreview.net/pdf/49af6eaca244f5ebde170ba49432f8ea782b359e.pdf",
  },
  {
    id: "stroke-patent",
    kind: "patent",
    title: "AI-Driven Rapid Diagnosis and Management of Acute Ischemic Stroke",
    authors: [],
    authorsNote: "Registered patent holder",
    role: "Patent holder",
    venue: "Registered patent",
    contribution:
      "An imaging-based system for stroke detection, diagnosis and monitoring; all three core pipeline features validated, currently at MVP stage.",
  },
];

export const publicationGroups: { kind: PublicationKind; label: string }[] = [
  { kind: "journal", label: "Journal Publications" },
  { kind: "conference", label: "Conference & Workshop" },
  { kind: "patent", label: "Patents" },
];

export const service = ["Reviewer — Aging (journal)"];
