export type Milestone = {
  year: string;
  title: string;
  text: string;
  tags: string[];
  /** Small "artifact" shown with the milestone. */
  artifact: { label: string; value: string };
};

export const timeline: Milestone[] = [
  {
    year: "2016",
    title: "Foundations",
    text: "B.Sc. in Computer Engineering at Yazd Meybod University. While studying, co-founded an AI platform that combined ML with electronic health records to assess recessive genetic-disorder risk in prospective couples.",
    tags: ["Computer Engineering", "First ML in health"],
    artifact: { label: "B.Sc.", value: "2016 – 2020" },
  },
  {
    year: "2022",
    title: "Research Begins",
    text: "Ranked 20th of 20,000+ in the national Master's entrance exam and joined Sharif University of Technology — M.Sc. in Bioinformatics, research in Prof. Rabiee's Data Science & ML Lab and Prof. Shamloo's Nano Biotechnology Lab.",
    tags: ["Sharif University", "Medical image analysis"],
    artifact: { label: "National rank", value: "20th / 20,000+" },
  },
  {
    year: "2023",
    title: "Learning to Teach",
    text: "Neuromatch Academy deep-learning school; Head TA for Deep Learning, leading 12 TAs; Senior TA for a 4,500-student programming course with 100+ TAs. Top 10% of the Bioinformatics M.Sc. cohort.",
    tags: ["Neuromatch", "Head TA"],
    artifact: { label: "Students reached", value: "4,500+" },
  },
  {
    year: "2024",
    title: "PanSAM",
    text: "First-author paper at the ICML 2024 Foundation Model Workshop: prompt-free, zero-shot pancreas segmentation built on the Segment Anything Model. Co-founded Beast Stroke.",
    tags: ["ICML workshop", "Foundation models"],
    artifact: { label: "Dice · NIH", value: "87.01%" },
  },
  {
    year: "2025",
    title: "Clinical AI Research",
    text: "AI-driven tongue-image analysis for coronary artery disease published in Scientific Reports. Joined Fanap as AI Expert to lead an agentic hiring system and multi-LLM serving.",
    tags: ["Scientific Reports", "Agentic AI"],
    artifact: { label: "Patients", value: "906" },
  },
  {
    year: "2026",
    title: "Expanding Research Frontiers",
    text: "A systematic review in the Journal of International Medical Research, and continuing work on trustworthy AI, foundation models and autonomous agents.",
    tags: ["Trustworthy AI", "Agents"],
    artifact: { label: "Focus", value: "Reliability" },
  },
];
