"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { useRef } from "react";
import Button from "@/components/Button";
import { GitHubIcon, LinkedInIcon, ScholarIcon } from "@/components/icons";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import { sceneState } from "@/lib/sceneStore";

gsap.registerPlugin(ScrollTrigger);

/** SCENE 10 — The final connection. Everything converges into the core. */
export default function Finale() {
  const root = useRef<HTMLElement>(null);
  const q1 = useRef<HTMLDivElement>(null);
  const q2 = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set([q1.current, q2.current], { opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom bottom", scrub: 1 },
        });
        tl.to(sceneState, { converge: 1, dim: 0, duration: 3, ease: "power2.inOut" }, 0)
          .to(sceneState, { dolly: 0.85, duration: 2.5, ease: "power2.in" }, 2.2)
          .to(sceneState, { fadeOut: 1, duration: 1.2 }, 4)
          .to(dark.current, { opacity: 0.55, duration: 1.2 }, 4)
          .fromTo(q1.current, { opacity: 0, y: 40, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 }, 4.4)
          .to(q1.current, { opacity: 0.45, duration: 0.6 }, 5.9)
          .fromTo(q2.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 5.9)
          .to({}, { duration: 1 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([q1.current, q2.current], { opacity: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const links = [
    site.contact.email && { label: "Contact", href: `mailto:${site.contact.email}`, icon: <Mail size={14} />, primary: true },
    site.social.linkedin && { label: "LinkedIn", href: site.social.linkedin, icon: <LinkedInIcon size={14} /> },
    site.social.scholar && { label: "Google Scholar", href: site.social.scholar, icon: <ScholarIcon size={14} /> },
    site.social.github && { label: "GitHub", href: site.social.github, icon: <GitHubIcon size={14} /> },
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode; primary?: boolean }[];

  return (
    <section id="contact" ref={root} className="relative h-[260svh] motion-reduce:h-auto" aria-label="Contact">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden motion-reduce:static motion-reduce:py-32">
        <div ref={dark} aria-hidden className="pointer-events-none absolute inset-0 bg-bg opacity-0" />
        <div className="container-x relative text-center">
          <div ref={q1}>
            <div className="label mb-6 text-cyan">09 — The final connection</div>
            <h2 className="display mx-auto max-w-5xl text-[clamp(2.2rem,6.4vw,6rem)] text-ink">
              THE NEXT DISCOVERY <span className="text-outline">STARTS WITH A QUESTION.</span>
            </h2>
          </div>
          <div ref={q2} className="mt-12">
            <p className="font-display text-[clamp(1.1rem,2vw,1.6rem)] font-light tracking-tight text-ink/90">Let&rsquo;s explore what we can build together.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {links.map((l) => (
                <Button key={l.label} href={l.href} variant={l.primary ? "primary" : "ghost"} icon={l.icon} external={!l.href.startsWith("mailto:")} cursor={l.primary ? "WRITE" : "OPEN"}>
                  {l.label}
                </Button>
              ))}
              {site.cv && (
                <Button href={asset(site.cv)} variant="ghost" icon={<Download size={14} />} download cursor="SAVE">
                  Download CV
                </Button>
              )}
            </div>
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.08em] text-mute transition-colors hover:text-cyan">
                {site.contact.email} <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
