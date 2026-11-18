/**
 * Professional experience, teaching, skills — all from the CV.
 * In `text` fields, wrap words in **double asterisks** to bold them.
 */

export type RolePoint = { lead?: string; text: string };

export type Role = {
  id: string;
  org: string;
  title: string;
  place: string;
  period: string;
  kind: "Industry" | "Teaching" | "Venture";
  /** One line that sums the role up. */
  headline: string;
  /** The system built in this role, left → right. Drawn as an animated pipeline. */
  flow: string[];
  /** Label above the flow diagram (default "System built"). */
  flowLabel?: string;
  points: RolePoint[];
  stack: string[];
};

export const roles: Role[] = [
  {
    id: "fanap",
    org: "Fanap",
    title: "AI Expert",
    place: "Tehran, Iran",
    period: "Feb 2025 — Present",
    kind: "Industry",
    headline: "Production LLM systems — from the GPU cluster up to the agents.",
    flow: ["GPU cluster", "LLM serving", "Multi-agent pipeline", "Hiring decisions"],
    points: [
      {
        lead: "Agentic HR Hiring System — Technical Team Lead",
        text: "Designed and led an end-to-end **multi-agent pipeline** for recruitment: **semantic matching** of candidates to job descriptions, **suitability scoring and ranking**, **AI-generated interview questions** (technical and HR), and **automated evaluation** of candidates' answers — LLM agents with **structured tool use** across retrieval, reasoning and generation.",
      },
      {
        lead: "LLM Serving & Inference Research",
        text: "Built an end-to-end **API serving platform for multiple open-source LLMs** using **continuous batching, PagedAttention, tensor/pipeline parallelism, prefix caching** and quantization (**FP8, GPTQ, AWQ**); **knowledge distillation** to compress models for production; research on **speculative decoding** and **hallucination mitigation** (decoding strategies, RAG, output quality).",
      },
      {
        lead: "Conversational AI Architecture",
        text: "Led design and implementation of a **production chatbot across every layer**: model serving, context and session management, **multi-turn dialogue**, and efficient user-data storage and retrieval.",
      },
      {
        lead: "GPU Cluster & Infrastructure",
        text: "Technical collaboration with **NTG and Huawei** engineers on **multi-GPU cluster** setup, interconnect configuration and hardware-level optimisation; worked with the Huawei Cloud team on **ModelArts** and **DataArts**.",
      },
    ],
    stack: ["Multi-agent", "Tool use", "RAG", "Continuous batching", "PagedAttention", "FP8 / GPTQ / AWQ", "Distillation", "Huawei ModelArts", "DataArts"],
  },
  {
    id: "rahnema",
    org: "Rahnema College",
    title: "Machine Learning Instructor",
    place: "Tehran, Iran · On-site",
    period: "Oct 2026 — Present",
    kind: "Teaching",
    headline: "Teaching engineers to build AI agents — and ship them in containers.",
    flow: ["LLM agents", "Tool use & function calling", "Multi-step reasoning", "Docker & Compose", "Deployed agent projects"],
    flowLabel: "Curriculum",
    points: [
      {
        lead: "Agentic AI",
        text: "Taught **Agentic AI**: **LLM-based agents**, **tool use**, **function calling** and **multi-step reasoning**.",
      },
      {
        lead: "Docker, hands-on",
        text: "Delivered hands-on **Docker** training: **containerizing applications**, writing **Dockerfiles**, and using **Docker Compose** for multi-service setups.",
      },
      {
        lead: "End-to-end projects",
        text: "Guided students in **building and deploying containerized AI-agent projects end to end**.",
      },
      {
        lead: "Machine Learning Bootcamp",
        text: "Instructor of Rahnema's **Machine Learning Bootcamp**, with a focus on **model serving**, **Docker** and **Retrieval-Augmented Generation (RAG)**.",
      },
    ],
    stack: ["Agentic AI", "Function calling", "Docker", "Docker Compose", "RAG"],
  },
  {
    id: "sharif-icds",
    org: "Sharif Innovation Center",
    title: "Data Engineer — Team Lead",
    place: "Innovation Center of Data Science & AI, Sharif University of Technology",
    period: "Jan 2025 — Feb 2026",
    kind: "Industry",
    headline: "Data platforms and MLOps that turn raw data into fine-tuned, served models.",
    flow: ["Raw sources", "Spark ETL", "Airflow", "LakeFS", "Axolotl fine-tuning", "K8s inference"],
    points: [
      { lead: "Pipeline architecture", text: "Designed and led a **scalable data-pipeline architecture** for large-scale dataset processing." },
      { lead: "ETL & versioning", text: "Built ETL workflows with **Apache Spark**, **Apache Airflow** and **LakeFS** for **version-controlled data management**." },
      { lead: "Data quality", text: "Established **data-quality frameworks** for consistency and reliability across multiple sources." },
      {
        lead: "MLOps",
        text: "**Distributed fine-tuning** of open-source LLMs (**Llama, Mistral, Qwen**) across multiple GPUs with **Axolotl**; **auto-scaling inference on Kubernetes**; better GPU utilisation through **MIG partitioning**.",
      },
    ],
    stack: ["Spark", "Airflow", "LakeFS", "Axolotl", "Kubernetes", "MIG"],
  },
  {
    id: "mcinext",
    org: "MCINEXT",
    title: "Data Scientist",
    place: "Tehran, Iran",
    period: "Jan 2024 — Jan 2025",
    kind: "Industry",
    headline: "Forecasting, speech and sentiment — models in front of real customers.",
    flow: ["Customer calls", "ASR", "Sentiment analysis", "Monitoring dashboards"],
    points: [
      { lead: "Forecasting", text: "Built **predictive models for electricity-consumption forecasting** and interactive **monitoring dashboards**." },
      { lead: "Sentiment", text: "Designed a **sentiment-analysis pipeline** for customer-service interactions." },
      { lead: "Speech", text: "Developed and optimised an **Automatic Speech Recognition (ASR)** model for call transcription." },
    ],
    stack: ["Forecasting", "Sentiment analysis", "ASR", "Dashboards"],
  },
  {
    id: "tapsell",
    org: "Tapsell",
    title: "Data Analyst",
    place: "Tehran, Iran",
    period: "Jan 2023 — Jan 2024",
    kind: "Industry",
    headline: "Real-time visibility into a live system.",
    flow: ["Live events", "Kibana", "Fault detection"],
    points: [{ text: "Built **real-time dashboards** and **automated monitoring systems for fault detection** using **Kibana**." }],
    stack: ["Kibana", "Real-time monitoring"],
  },
  {
    id: "zistagen",
    org: "Zistagen Sharif",
    title: "Software Developer",
    place: "Tehran, Iran",
    period: "Oct 2021 — Nov 2022",
    kind: "Industry",
    headline: "Software for the genetics lab.",
    flow: ["PCR", "Analysis", "Diagnostics"],
    points: [{ text: "Enhanced the **PCR technique**, improving **efficiency and accuracy** for genetic analysis and diagnostics." }],
    stack: ["PCR", "Genetic diagnostics"],
  },
  {
    id: "beast-stroke",
    org: "Beast Stroke",
    title: "Co-Founder",
    place: "Tehran, Iran",
    period: "Mar 2024 — Present",
    kind: "Venture",
    headline: "A diagnostic system for the minutes that matter in stroke.",
    flow: ["Brain imaging", "Lesion detection", "Localisation", "Volume quantification", "Treatment recommendation"],
    points: [
      {
        text: "Building a medical diagnostic system that integrates ML for **brain-lesion detection, localisation, volume quantification and treatment recommendation** — backed by a **registered patent**.",
      },
    ],
    stack: ["Medical imaging", "Lesion detection", "Volume quantification"],
  },
  {
    id: "genetic-screening",
    org: "Premarital Genetic Screening Platform",
    title: "Co-Founder, ML Engineer & Web Developer",
    place: "Science & Technology Park, Yazd",
    period: "Sep 2017 — Sep 2018",
    kind: "Venture",
    headline: "First startup: genetic-risk screening for couples.",
    flow: ["Health records", "ML risk model", "Early detection"],
    points: [
      {
        text: "Co-founded an **AI-driven platform** that assesses **genetic-disorder risk** in prospective couples, integrating ML with **electronic health records** for early detection of recessive diseases (**cystic fibrosis, sickle-cell anaemia**).",
      },
    ],
    stack: ["Machine learning", "EHR", "Web development"],
  },
];

/** Big numbers for the engineering track — every one is countable from the CV. */
export const engineeringStats = [
  { value: 6, suffix: "", label: "Organisations", note: "Fanap · Rahnema · Sharif · MCINEXT · Tapsell · Zistagen" },
  { value: 2, suffix: "", label: "Startups co-founded", note: "Beast Stroke · Genetic screening" },
  { value: 3, suffix: "", label: "LLM families fine-tuned", note: "Llama · Mistral · Qwen" },
  { value: 1, suffix: "", label: "Registered patent", note: "Acute ischemic stroke" },
];

export const teachingStats = [
  { value: 4500, suffix: "+", label: "Students", note: "Algorithmic Creativity & Python" },
  { value: 100, suffix: "+", label: "TAs coordinated", note: "Algorithmic Creativity & Python" },
  { value: 80, suffix: "", label: "Practice sessions", note: "Managed" },
  { value: 12, suffix: "", label: "TAs led", note: "Deep Learning, Head TA" },
];

export const teaching: { role: string; course: string; period: string; org: string }[] = [
  { role: "ML Instructor", course: "Agentic AI & Docker — agents, tool use, function calling, Compose", period: "Oct 2026 — Present", org: "Rahnema College" },
  { role: "Bootcamp Instructor", course: "Machine Learning Bootcamp — model serving, Docker & RAG", period: "", org: "Rahnema College" },
  { role: "Bootcamp Mentor & Instructor", course: "ML, AI Fundamentals, AI in Industry, Python", period: "2024 — 2025", org: "Sharif Innovation Center" },
  { role: "Head TA", course: "Generative AI — Dr. Seyyedsalehi", period: "Spring 2025", org: "Sharif" },
  { role: "TA", course: "Machine Learning — Dr. Sharifi", period: "Spring 2025", org: "Sharif" },
  { role: "TA", course: "Natural Language Processing — Dr. Asgari", period: "Spring 2024", org: "Sharif" },
  { role: "Head TA", course: "Deep Learning — Prof. Beigy · led 12 TAs", period: "Fall 2023", org: "Sharif" },
  { role: "TA", course: "Modern Information Retrieval — Prof. Beigy", period: "2023", org: "Sharif" },
  { role: "TA", course: "Artificial Intelligence — Dr. Rohban", period: "2023", org: "Sharif" },
  { role: "Senior TA", course: "Algorithmic Creativity & Python — 4,500+ students", period: "2023", org: "Sharif" },
  { role: "Instructor & Question Designer", course: "AI Committee, Young Scholars Club", period: "2024", org: "YSC" },
  { role: "Bootcamp Mentor", course: "Data Science Principles & Techniques, Micromaster", period: "Jan — Jun 2024", org: "Sharif" },
  { role: "Workshop Mentor", course: "AI in Medicine", period: "2023", org: "Sharif" },
];

export type SkillLevel = "Proficient" | "Intermediate" | "Familiar";
export type SkillGroup = { group: string; items: { name: string; level?: SkillLevel }[] };

export const skillGroups: SkillGroup[] = [
  {
    group: "Programming",
    items: [
      { name: "Python", level: "Proficient" },
      { name: "SQL / T-SQL", level: "Proficient" },
      { name: "C / C#", level: "Intermediate" },
      { name: "Bash", level: "Intermediate" },
      { name: "HTML / CSS", level: "Intermediate" },
      { name: "JavaScript", level: "Familiar" },
      { name: "MATLAB", level: "Familiar" },
    ],
  },
  {
    group: "ML / DL",
    items: ["PyTorch", "PyTorch Geometric", "Lightning", "TensorFlow", "Keras", "scikit-learn", "Polars", "Pandas", "NumPy", "Matplotlib", "OpenCV"].map((name) => ({ name })),
  },
  {
    group: "LLM & Agents",
    items: ["vLLM", "LiteLLM", "OpenRouter", "Axolotl", "MCP", "Multi-agent", "RAG", "OpenAI-compatible APIs"].map((name) => ({ name })),
  },
  {
    group: "Data Engineering",
    items: ["Spark", "Airflow", "LakeFS", "DVC", "Git LFS", "Hellodata BE"].map((name) => ({ name })),
  },
  {
    group: "MLOps",
    items: ["ClearML", "MLflow", "Kubernetes", "MIG", "Docker"].map((name) => ({ name })),
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "SQL Server", "MongoDB", "MySQL", "SQLite", "ClickHouse", "Milvus", "Qdrant"].map((name) => ({ name })),
  },
  {
    group: "Deployment & APIs",
    items: ["FastAPI", "Django", "Docker", "Kubernetes"].map((name) => ({ name })),
  },
  {
    group: "Visualization & Tools",
    items: ["Kibana", "Superset", "Power BI", "Git", "LaTeX"].map((name) => ({ name })),
  },
];

/** Skill name → where it was used (roles' `stack`). Case-insensitive. */
export function whereUsed(skill: string) {
  const s = skill.toLowerCase();
  return roles.filter((r) => r.stack.some((t) => t.toLowerCase() === s)).map((r) => r.org);
}

export const education = [
  {
    degree: "M.Sc. Bioinformatics",
    org: "Sharif University of Technology",
    period: "2022 — Present",
    detail: "GPA 18.21 / 20 · Supervisors: Prof. Hamid R. Rabiee & Prof. Amir Shamloo",
  },
  {
    degree: "B.Sc. Computer Engineering",
    org: "Yazd Meybod University",
    period: "2016 — 2020",
    detail: "",
  },
  {
    degree: "Deep Learning Summer School",
    org: "Neuromatch Academy — Interactive Track",
    period: "Jul — Aug 2023",
    detail: "",
  },
];

export const honors = [
  "Top 10% of Bioinformatics M.Sc. students, Sharif University — 2023",
  "Ranked 20th of 20,000+ in the National Master's Entrance Exam — 2022",
];

export const certifications = [
  "Deep Learning Interactive Track — Neuromatch Academy, 2023",
  "Machine Learning Specialization — DeepLearning.AI, 2023",
  "Neural Networks and Deep Learning — Coursera, 2022",
  "Professional Backend Development with Django — Quera, 2021",
];

export const languages = [
  { name: "Persian", level: "Native" },
  { name: "English", level: "Professional working proficiency" },
];

export const currentInterests = [
  "Reliable adaptation of vision foundation models to clinical data",
  "Interpretability that clinicians can actually use",
  "Agentic systems with verifiable tool use",
  "Efficient LLM inference: speculative decoding, quantization",
];

/** Strip **bold** markers for plain-text uses (assistant, meta). */
export const plain = (t: string) => t.replace(/\*\*/g, "");
