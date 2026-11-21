/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — the one file to edit for personal details.
 *  Everything here comes from the CV (Abolfazl_Malekahmadi_CV.pdf).
 *  Set any field to `null` to hide it from the site.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: { first: "Abolfazl", last: "Malekahmadi" },
  shortName: "A. Malekahmadi",
  /** Wordmark in the nav / intro, and the monogram in the badge + favicon. */
  brand: "MALEKAHMADI",
  monogram: "AM",
  tagline: "Beyond Intelligence.",
  role: "AI Researcher & Engineer",
  eyebrow: "AI RESEARCHER & ENGINEER · SHARIF UNIVERSITY OF TECHNOLOGY",
  headline: "Building AI that works on real patients — and in real production.",
  intro:
    "I research intelligent systems at the intersection of medical imaging, foundation models, and autonomous AI agents — and engineer the LLM systems that run them in production.",

  /** The two tracks the hero splits into. `target` is a section id. */
  tracks: [
    {
      target: "research",
      index: "01",
      label: "Research",
      title: "Medical AI & foundation models",
      points: ["ICML · Scientific Reports", "PanSAM — Dice 87.01%", "Registered patent"],
    },
    {
      target: "experience",
      index: "02",
      label: "Engineering",
      title: "LLM systems in production",
      points: ["Multi-agent pipelines", "Multi-LLM serving", "Data platforms & MLOps"],
    },
  ],
  focus: ["Medical AI", "Foundation Models", "Autonomous Agents"],
  location: "Tehran, Iran",

  philosophy:
    "I believe the future of AI lies not only in building more capable models, but in making them reliable, interpretable, and useful in the real world.",

  /** The one line shown big in About (the rest of the bio is in the hero/strip already). */
  about:
    "I am drawn to problems where rigorous methodology meets real-world constraints — where a model has to work on actual patients, under actual hardware limits.",

  /** Long-form bio (from the CV summary) — used by the assistant. */
  bio: [
    "AI researcher and engineer with an M.Sc. in Bioinformatics from Sharif University of Technology, working at the intersection of medical image analysis, foundation models, and large-scale LLM systems.",
    "I am drawn to problems where rigorous methodology meets real-world constraints — where a model has to work on actual patients, under actual hardware limits.",
    "Research-active with publications at ICML and Nature Scientific Reports, a registered patent, and production AI systems deployed at scale.",
  ],

  /**
   * Portrait: put a file in /public/media (e.g. portrait.jpg) and set
   * `portrait: "/media/portrait.jpg"`. While null, a neutral monogram is shown.
   */
  portrait: "/media/portrait.jpg" as string | null,
  /** Small round photo used in the PhD reminder and form. */
  avatar: "/media/avatar.jpg" as string | null,

  /**
   * Credibility strip right under the hero. Links starting with "#" scroll
   * within the page; others open the source in a new tab.
   */
  credentials: [
    {
      value: "ICML 2024",
      label: "First author",
      detail: "PanSAM · Foundation Model Workshop",
      href: "https://openreview.net/pdf/49af6eaca244f5ebde170ba49432f8ea782b359e.pdf",
    },
    {
      value: "Sci. Reports",
      label: "Nature Portfolio · 2025",
      detail: "AI team lead · 906 patients",
      href: "https://www.nature.com/articles/s41598-025-28417-4",
    },
    {
      value: "Patent",
      label: "Registered",
      detail: "AI-driven acute stroke diagnosis",
      href: "#pub-stroke-patent",
    },
    {
      value: "87.01%",
      label: "Dice · NIH Pancreas",
      detail: "Zero-shot, prompt-free SAM",
      href: "https://openreview.net/pdf/49af6eaca244f5ebde170ba49432f8ea782b359e.pdf",
    },
  ],

  /** Path to the CV inside /public. Set to null to hide every "CV" button. */
  cv: "/Abolfazl_Malekahmadi_CV.pdf" as string | null,

  /**
   * PhD search announcement. Set `open: false` to hide the badge, nav button
   * and section everywhere.
   */
  phd: {
    open: true,
    /** e.g. "Fall 2027". Leave null if flexible — it is then not shown. */
    start: null as string | null,
    badge: "Open to PhD positions",
    pitch:
      "I am looking for a PhD position where I can work on AI that is reliable, interpretable and useful in the real world — especially in medical imaging, foundation models and agentic systems.",
    /** Shown as "What I bring". **bold** is supported. */
    bring: [
      "**First-author** paper at the **ICML 2024** Foundation Model Workshop",
      "AI team lead on a **Scientific Reports** study validated on **906 patients**",
      "A **registered patent** in AI-driven stroke diagnosis",
      "**Production LLM systems** — multi-agent pipelines and multi-LLM serving",
      "**Head TA** for Deep Learning and Generative AI at Sharif",
    ],
    /**
     * Where form submissions go. No backend needed:
     * - "formsubmit": works with just the email below. The very first submission
     *   sends an activation email to that inbox — click "Activate Form" once.
     * - "web3forms": get a free key at web3forms.com and put it in `web3formsKey`.
     */
    form: {
      provider: "formsubmit" as "formsubmit" | "web3forms",
      web3formsKey: null as string | null,
    },
  },

  contact: {
    email: "abolfazlmalekahmadi@gmail.com" as string | null,
    academicEmail: "abo.malek401@sharif.edu" as string | null,
  },

  social: {
    linkedin: "https://www.linkedin.com/in/abolfazl-malekahmadi/" as string | null,
    github: "https://github.com/abolfazlmalekahmadi" as string | null,
    scholar: "https://scholar.google.com/citations?user=CwaP1f0AAAAJ&hl=en" as string | null,
    stackoverflow: "https://stackoverflow.com/users/10356618/abolfazlmalekahmadi" as string | null,
  },
} as const;

export type Site = typeof site;
