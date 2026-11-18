/** Section order for navigation and the scroll-progress rail. */
export const sections = [
  { id: "identity", label: "Identity", nav: null },
  { id: "mind", label: "Into the Mind", nav: null },
  { id: "research", label: "Research", nav: "Research" },
  { id: "projects", label: "Projects", nav: "Projects" },
  { id: "publications", label: "Publications", nav: "Publications" },
  { id: "experience", label: "Experience", nav: "Experience" },
  { id: "journey", label: "Journey", nav: "Journey" },
  { id: "about", label: "About", nav: "About" },
  { id: "contact", label: "Contact", nav: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Nav order (About first, as in the brief). */
export const navItems: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "experience", label: "Experience" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];
