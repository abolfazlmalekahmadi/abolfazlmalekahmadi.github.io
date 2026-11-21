/**
 * Research case studies. Each project picks a `visual` — the interactive
 * component used to tell its story (see src/sections/archive/visuals).
 * Add a new entry here to add a project; add a new visual type only if
 * none of the existing ones fit.
 */

export type Metric = {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  note?: string;
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  fullTitle: string;
  year: number;
  venue?: string;
  role: string;
  description: string;
  highlights: string[];
  metrics: Metric[];
  stack: string[];
  links: ProjectLink[];
  visual: "segmentation" | "pipeline" | "agents";
  /**
   * Optional real imagery. Drop files in /public/media and set the paths —
   * the visual will use them instead of the schematic illustration.
   */
  media?: { input?: string; output?: string };
  /** Shown under the visual so nobody mistakes a schematic for real data. */
  visualNote: string;
};

export const projects: Project[] = [
  {
    id: "pansam",
    index: "01",
    kicker: "Foundation Models × Medical Imaging",
    title: "PanSAM",
    fullTitle: "PanSAM: Zero-Shot, Prompt-Free Pancreas Segmentation in CT Imaging",
    year: 2024,
    venue: "ICML 2024 · Foundation Model Workshop",
    role: "First author",
    description:
      "A prompt-free approach to adapting the Segment Anything Model for pancreas segmentation, using model-derived probability maps to eliminate manual prompts.",
    highlights: [
      "First prompt-free SAM-based pancreas segmentation",
      "Prompts come from the model's own probability maps — interpretable by design",
      "Zero-shot generalization to out-of-domain Abdominal-1K",
    ],
    metrics: [
      { label: "Dice", value: 87.01, decimals: 2, suffix: "%", note: "NIH pancreas dataset" },
      { label: "Jaccard", value: 81.42, decimals: 2, suffix: "%", note: "NIH pancreas dataset" },
    ],
    stack: ["PyTorch", "Segment Anything", "3D aggregation", "CT"],
    links: [
      { label: "Paper · OpenReview", href: "https://openreview.net/pdf/49af6eaca244f5ebde170ba49432f8ea782b359e.pdf" },
      { label: "Code · GitHub", href: "https://github.com/abolfazlmalekahmadi/PSDDSAM/tree/final" },
    ],
    visual: "segmentation",
    visualNote: "Schematic axial CT illustration — not patient data.",
  },
  {
    id: "cad-tongue",
    index: "02",
    kicker: "Clinical AI · Nature Portfolio",
    title: "Tongue → Heart",
    fullTitle: "AI-driven Tongue Image Analysis for Diagnosing and Predicting Coronary Artery Disease",
    year: 2025,
    venue: "Scientific Reports · Nature Portfolio · 2025",
    role: "Co-author · AI Team Lead",
    description:
      "Non-invasive coronary artery disease screening from a tongue photo: segment, extract foundation-model features, classify stenosis per artery.",
    highlights: [
      "SAM segmentation + DeepLabv3+ / DINOv2 features, per-artery stenosis heads",
      "Tongue colour and fissures are the dominant predictors",
      "Occlusion sensitivity shows what the model is looking at",
    ],
    metrics: [
      { label: "Patients", value: 906, note: "clinical validation cohort" },
      { label: "Images", value: 12000, note: "tongue photographs" },
      { label: "LCX accuracy", value: 80, suffix: "%", prefix: "≤ ", note: "up to, for LCX stenosis" },
    ],
    stack: ["SAM", "DINOv2", "DeepLabv3+", "Occlusion sensitivity"],
    links: [{ label: "Article · Scientific Reports", href: "https://www.nature.com/articles/s41598-025-28417-4" }],
    visual: "pipeline",
    visualNote: "Schematic pipeline — illustrations, not patient images.",
  },
  {
    id: "agents",
    index: "03",
    kicker: "Autonomous AI Agents · Production",
    title: "Agentic Hiring",
    fullTitle: "An End-to-End Multi-Agent Pipeline for Automated Recruitment",
    year: 2025,
    venue: "Fanap · Technical Team Lead",
    role: "Designer & technical lead",
    description:
      "LLM agents with structured tool use that match candidates to roles, rank them, write interview questions and evaluate the answers.",
    highlights: [
      "Semantic matching, suitability scoring and ranking",
      "AI-generated interview questions and automated answer evaluation",
      "Served on a self-hosted multi-LLM platform",
    ],
    metrics: [],
    stack: ["LLM agents", "Tool use", "RAG", "vLLM", "LiteLLM", "MCP"],
    links: [],
    visual: "agents",
    visualNote: "Illustrative simulation — runs in your browser, not connected to the production system.",
  },
];

/** Smaller entries shown under the featured case studies. */
export const otherWork: { title: string; year: string; text: string; href?: string }[] = [
  {
    title: "Stroke Diagnosis & Monitoring",
    year: "2024 —",
    text: "Imaging-based stroke detection, diagnosis and monitoring. Patent registered; co-founded Beast Stroke to build it.",
  },
  {
    title: "Perianal Fistula Detection",
    year: "In progress",
    text: "Segmentation and classification of perianal fistulas in MRI. Patent application in preparation.",
  },
  {
    title: "Multi-LLM Serving Platform",
    year: "2025 —",
    text: "Continuous batching, PagedAttention, tensor/pipeline parallelism, prefix caching, FP8/GPTQ/AWQ, distillation.",
  },
  {
    title: "Chest X-ray Captioning",
    year: "2023",
    text: "CNN-LSTM baseline, then fine-tuned BLIP and GIT for diagnostic captioning of chest X-rays.",
    href: "https://github.com/abolfazlmalekahmadi/chest_xray",
  },
  {
    title: "qPCR Image Processing",
    year: "2022 —",
    text: "Real-time fluorescence-intensity analysis for DNA amplification detection in a qPCR device.",
  },
  {
    title: "QA with DistilBERT",
    year: "2023",
    text: "DistilBERT fine-tuned on SQuAD v2 for extractive question answering.",
    href: "https://github.com/abolfazlmalekahmadi/Bert_for_Question_and_Answering",
  },
];
