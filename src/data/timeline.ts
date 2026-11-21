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
    text: "B.Sc. in Computer Engineering — and a first health-AI startup on genetic-risk screening.",
    tags: ["Computer Engineering", "First ML in health"],
    artifact: { label: "B.Sc.", value: "2016 – 2020" },
  },
  {
    year: "2022",
    title: "Research Begins",
    text: "Ranked 20th of 20,000+ nationally; started the M.Sc. in Bioinformatics at Sharif.",
    tags: ["Sharif University", "Medical image analysis"],
    artifact: { label: "National rank", value: "20th / 20,000+" },
  },
  {
    year: "2023",
    title: "Learning to Teach",
    text: "Neuromatch deep-learning school, Head TA for Deep Learning, top 10% of the cohort.",
    tags: ["Neuromatch", "Head TA"],
    artifact: { label: "Students reached", value: "4,500+" },
  },
  {
    year: "2024",
    title: "PanSAM",
    text: "First-author ICML workshop paper (PanSAM); co-founded Beast Stroke.",
    tags: ["ICML workshop", "Foundation models"],
    artifact: { label: "Dice · NIH", value: "87.01%" },
  },
  {
    year: "2025",
    title: "Clinical AI Research",
    text: "Scientific Reports paper on tongue-based CAD diagnosis; joined Fanap as AI Expert.",
    tags: ["Scientific Reports", "Agentic AI"],
    artifact: { label: "Patients", value: "906" },
  },
  {
    year: "2026",
    title: "Expanding Research Frontiers",
    text: "A JIMR systematic review, teaching Agentic AI at Rahnema, and a focus on trustworthy AI.",
    tags: ["Trustworthy AI", "Agents"],
    artifact: { label: "Focus", value: "Reliability" },
  },
];
