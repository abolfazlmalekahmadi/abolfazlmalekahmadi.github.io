export type ResearchDomain = {
  id: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  topics: string[];
  /** Concrete work from the CV that lives in this domain. */
  evidence: string[];
};

export const researchDomains: ResearchDomain[] = [
  {
    id: "medical",
    index: "01",
    title: "Medical AI",
    short: "MED",
    summary:
      "Models that have to work on real patients: segmentation, diagnosis and monitoring from CT, MRI and clinical photographs.",
    topics: ["Medical Image Analysis", "Medical Image Segmentation", "Clinical AI", "Computer Vision"],
    evidence: [
      "PanSAM — prompt-free pancreas segmentation in CT",
      "Tongue-image CAD diagnosis — validated on 906 patients",
      "Imaging-based stroke detection & monitoring (patent registered)",
      "Perianal fistula segmentation in MRI (in progress)",
    ],
  },
  {
    id: "foundation",
    index: "02",
    title: "Foundation Models",
    short: "FND",
    summary:
      "Adapting large pre-trained models — SAM and DINOv2 for vision, open LLMs for language — to domains they were never trained on, without manual supervision at inference time.",
    topics: ["Vision Foundation Models", "Self-Supervised Learning", "Model Adaptation", "Generalization"],
    evidence: [
      "SAM adapted for zero-shot, prompt-free segmentation",
      "DINOv2 / DeepLabv3+ features for stenosis classification",
      "Zero-shot generalization to out-of-domain Abdominal-1K",
      "Distributed fine-tuning of open LLMs — Llama, Mistral and Qwen",
    ],
  },
  {
    id: "agents",
    index: "03",
    title: "Autonomous AI Agents",
    short: "AGT",
    summary:
      "LLM agents that plan, retrieve, use tools and reason over several steps — built to work in production, and taught to the engineers who will build the next ones.",
    topics: ["Multi-Agent Systems", "Tool Use & Function Calling", "Agentic Workflows", "Multi-Step Reasoning"],
    evidence: [
      "Agentic HR hiring system — designed and led a multi-agent pipeline (Fanap)",
      "LLM agents with structured tool use across retrieval, reasoning and generation",
      "Production conversational AI: multi-turn dialogue, context and session management",
      "Teaching Agentic AI at Rahnema College: agents, tool use, function calling",
    ],
  },
  {
    id: "trust",
    index: "04",
    title: "Trustworthy AI",
    short: "TRS",
    summary:
      "Interpretability and reliability as first-class goals: models whose decisions a clinician can inspect, and outputs that do not hallucinate.",
    topics: ["Explainable AI", "Uncertainty Estimation", "Robustness", "AI Safety"],
    evidence: [
      "Interpretable prompting from model probability maps (PanSAM)",
      "Occlusion-sensitivity & feature-importance analysis (CAD study)",
      "Hallucination mitigation: decoding strategies, RAG, output quality",
    ],
  },
];
