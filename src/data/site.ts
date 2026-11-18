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
  brand: "NEURAL",
  tagline: "Beyond Intelligence.",
  role: "AI Researcher & Engineer",
  eyebrow: "AI RESEARCHER & ENGINEER · SHARIF UNIVERSITY OF TECHNOLOGY",
  headline: "Exploring the Frontiers of AI.",
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

  /** Long-form bio (from the CV summary). */
  bio: [
    "AI researcher and engineer with an M.Sc. in Bioinformatics from Sharif University of Technology, working at the intersection of medical image analysis, foundation models, and large-scale LLM systems.",
    "I am drawn to problems where rigorous methodology meets real-world constraints — where a model has to work on actual patients, under actual hardware limits.",
    "Research-active with publications at ICML and Nature Scientific Reports, a registered patent, and production AI systems deployed at scale.",
  ],

  /**
   * Portrait: put a file in /public/media (e.g. portrait.jpg) and set
   * `portrait: "/media/portrait.jpg"`. While null, a neutral monogram is shown.
   */
  portrait: null as string | null,

  /** Path to the CV inside /public. Set to null to hide every "CV" button. */
  cv: "/Abolfazl_Malekahmadi_CV.pdf" as string | null,

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
