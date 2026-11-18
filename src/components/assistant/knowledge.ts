import { researchDomains } from "@/data/research";
import { projects } from "@/data/projects";
import { publications } from "@/data/publications";
import { education, plain, roles, skillGroups, teaching } from "@/data/experience";
import { site } from "@/data/site";
import type { Source } from "./types";

/**
 * Verified facts, generated from the same data files the site renders.
 * Nothing here is written separately — edit src/data/* and this updates.
 */
export type Fact = { id: string; keywords: string[]; text: string; sources: Source[] };

const sec = (id: string, label: string): Source => ({ label, href: `#${id}` });

export function buildKnowledge(): Fact[] {
  const facts: Fact[] = [];

  facts.push({
    id: "who",
    keywords: ["who", "about", "background", "yourself", "bio", "introduce", "researcher"],
    text: site.bio.join(" "),
    sources: [sec("about", "About")],
  });

  facts.push({
    id: "interests",
    keywords: ["research", "interests", "focus", "work on", "areas", "domains", "topics"],
    text: `${site.intro} The four domains are: ${researchDomains.map((d) => `${d.title} (${d.topics.slice(0, 2).join(", ")}…)`).join("; ")}.`,
    sources: [sec("research", "Research domains")],
  });

  researchDomains.forEach((d) => {
    facts.push({
      id: `domain-${d.id}`,
      keywords: [d.title.toLowerCase(), ...d.topics.map((t) => t.toLowerCase()), d.id],
      text: `${d.title}: ${d.summary} Related work: ${d.evidence.join("; ")}.`,
      sources: [sec("research", d.title)],
    });
  });

  projects.forEach((p) => {
    const metrics = p.metrics.map((m) => `${m.label} ${m.prefix ?? ""}${m.value.toLocaleString("en-US")}${m.suffix ?? ""}${m.note ? ` (${m.note})` : ""}`).join(", ");
    facts.push({
      id: `project-${p.id}`,
      keywords: [p.title.toLowerCase(), p.id, ...p.fullTitle.toLowerCase().split(/\W+/).filter((w) => w.length > 4), ...p.stack.map((s) => s.toLowerCase())],
      text: `${p.fullTitle} (${p.venue ?? p.year}; ${p.role}). ${p.description}${metrics ? ` Key results: ${metrics}.` : ""} Highlights: ${p.highlights.slice(0, 3).join("; ")}.`,
      sources: [sec("projects", p.title), ...p.links.map((l) => ({ label: l.label, href: l.href }))],
    });
  });

  facts.push({
    id: "publications",
    keywords: ["publications", "papers", "published", "journal", "conference", "patent", "publish"],
    text: publications.map((p) => `${p.title} — ${p.venue}${p.year ? `, ${p.year}` : ""} (${p.role})`).join(". ") + ".",
    sources: [sec("publications", "Publications"), ...publications.filter((p) => p.url).map((p) => ({ label: p.venue, href: p.url! }))],
  });

  publications.forEach((p) => {
    facts.push({
      id: `pub-${p.id}`,
      keywords: p.title.toLowerCase().split(/\W+/).filter((w) => w.length > 4).concat([p.venue.toLowerCase()]),
      text: `${p.title} — ${p.venue}${p.publisher ? `, ${p.publisher}` : ""}${p.year ? `, ${p.year}` : ""}. Role: ${p.role}. ${p.contribution}`,
      sources: p.url ? [{ label: p.venue, href: p.url }] : [sec("publications", "Publications")],
    });
  });

  facts.push({
    id: "experience",
    keywords: ["experience", "work", "job", "industry", "fanap", "company", "employment", "career"],
    text: roles.map((r) => `${r.title} at ${r.org} (${r.period}) — ${r.headline}`).join(" "),
    sources: [sec("experience", "Experience")],
  });

  roles.forEach((r) => {
    facts.push({
      id: `role-${r.id}`,
      keywords: [r.org.toLowerCase(), ...r.org.toLowerCase().split(/\W+/).filter((w) => w.length > 3), ...r.title.toLowerCase().split(/\W+/).filter((w) => w.length > 3), ...r.stack.map((x) => x.toLowerCase())],
      text: `${r.title} at ${r.org} (${r.period}). ${r.points.map((p) => (p.lead ? `${p.lead}: ` : "") + plain(p.text)).join(" ")}`,
      sources: [{ label: r.org, href: `#role-${r.id}` }],
    });
  });

  facts.push({
    id: "skills",
    keywords: ["skills", "tools", "stack", "technologies", "toolkit", "know", "programming", "languages", "frameworks"],
    text: skillGroups.map((g) => `${g.group}: ${g.items.map((i) => i.name).join(", ")}`).join(". ") + ".",
    sources: [sec("experience", "Toolkit")],
  });

  facts.push({
    id: "education",
    keywords: ["education", "degree", "university", "sharif", "study", "msc", "master", "bachelor", "gpa", "supervisor"],
    text: education.map((e) => `${e.degree}, ${e.org} (${e.period})${e.detail ? ` — ${e.detail}` : ""}`).join(". ") + ".",
    sources: [sec("about", "Academic background")],
  });

  facts.push({
    id: "teaching",
    keywords: ["teaching", "teach", "ta", "assistant", "instructor", "course", "bootcamp"],
    text: teaching.map((t) => `${t.role} — ${t.course} (${t.org}, ${t.period})`).join(". ") + ".",
    sources: [sec("experience", "Teaching")],
  });

  facts.push({
    id: "contact",
    keywords: ["contact", "email", "reach", "collaborate", "hire", "linkedin", "scholar", "cv", "resume"],
    text: `The best way to get in touch is ${site.contact.email ? `by email at ${site.contact.email}` : "through the contact section"}.${site.cv ? " The full CV is downloadable from the site." : ""}`,
    sources: [
      sec("contact", "Contact"),
      ...(site.social.linkedin ? [{ label: "LinkedIn", href: site.social.linkedin }] : []),
      ...(site.social.scholar ? [{ label: "Google Scholar", href: site.social.scholar }] : []),
    ],
  });

  facts.push({
    id: "philosophy",
    keywords: ["philosophy", "believe", "future", "why", "trust", "trustworthy", "reliable", "interpretable"],
    text: site.philosophy,
    sources: [sec("mind", "Research philosophy")],
  });

  return facts;
}
