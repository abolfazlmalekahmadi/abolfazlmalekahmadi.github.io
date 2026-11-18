import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg/80 backdrop-blur">
      <div className="container-x flex flex-col items-start justify-between gap-4 py-8 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute md:flex-row md:items-center">
        <span>
          © {new Date().getFullYear()} {site.name.first} {site.name.last}
        </span>
        <span className="text-ink/60">
          {site.monogram} — {site.tagline}
        </span>
        <span>{site.location}</span>
      </div>
    </footer>
  );
}
