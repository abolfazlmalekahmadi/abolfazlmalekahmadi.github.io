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
      "Adapting large pre-trained vision models — SAM, DINOv2 — to domains they were never trained on, without manual supervision at inference time.",
    topics: ["Vision Foundation Models", "Self-Supervised Learning", "Model Adaptation", "Generalization"],
    evidence: [
      "SAM adapted for zero-shot, prompt-free segmentation",
      "DINOv2 / DeepLabv3+ features for stenosis classification",
      "Zero-shot generalization to out-of-domain Abdominal-1K",
    ],
  },
  {
    id: "agents",
    index: "03",
    title: "Autonomous AI Agents",
    short: "AGT",
    summary:
      "LLM systems that plan, retrieve, reason and act — and the serving infrastructure that makes them fast enough to use.",
    topics: ["Large Language Models", "Multi-Agent Systems", "Agentic Workflows", "Reasoning"],
    evidence: [
      "Agentic HR hiring system — technical team lead (Fanap)",
      "Multi-LLM serving platform: vLLM, PagedAttention, FP8/GPTQ/AWQ",
      "Distributed fine-tuning of Llama, Mistral and Qwen families",
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
