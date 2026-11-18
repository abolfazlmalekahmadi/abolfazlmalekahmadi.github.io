# Abolfazl Malekahmadi — Portfolio

Cinematic research portfolio. Next.js (static export) · React Three Fiber · GSAP ScrollTrigger · Framer Motion · Lenis.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3100
npm run build      # static site in ./out
```

## Edit content

All content lives in `src/data/` — components never hard-code it.

| File | What |
|---|---|
| `site.ts` | **Name, bio, email, social links, CV path, portrait** |
| `research.ts` | The four research domains |
| `projects.ts` | Case studies + "more work" (add real CT images via `media`) |
| `publications.ts` | Papers & patent (author lists verified via Crossref) |
| `timeline.ts` | Journey milestones |
| `experience.ts` | Experience, education, teaching, skills |

- **Portrait:** put `portrait.jpg` in `public/media/` and set `portrait: "/media/portrait.jpg"` in `site.ts`.
- **CV:** replace `public/Abolfazl_Malekahmadi_CV.pdf` (or set `cv: null` to hide). Note the PDF contains a phone number.
- **Real PanSAM images:** add `public/media/pansam-input.png` / `pansam-output.png` and set `media` on the PanSAM project.

## Deploy to GitHub Pages

Live at **https://abolfazlmalekahmadi.github.io**.

GitHub Actions is currently unavailable on the account (billing lock), so the site is built locally and the static output is pushed to the `gh-pages` branch:

```bash
npm run deploy     # builds ./out and force-pushes it to gh-pages
git push           # (separately) push your source changes to main
```

Pages setting: **Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` / `(root)`**.

When Actions is available again, re-enable the `push` trigger in `.github/workflows/deploy.yml` and switch Pages → Source to **GitHub Actions**.

## Research assistant

The chat panel runs in **offline mode**: it retrieves verified facts from `src/data/*` by keyword, no LLM. To go live, deploy an endpoint (GitHub Pages is static, so e.g. a Cloudflare Worker) that accepts `POST { question, history }` and returns `{ text, sources: [{ label, href }] }`, then build with `NEXT_PUBLIC_ASSISTANT_ENDPOINT=https://…`. See `src/components/assistant/providers.ts`.

## Structure

```
src/three/        brainGeometry.ts (procedural brain), shaders.ts, NeuralScene.tsx (global canvas), DomainNetwork.tsx
src/sections/     Hero, Mind (pinned tunnel), Research, archive/*, Publications, Journey, About, Finale
src/components/   Intro, Nav, ScrollRail, Cursor, Magnetic, Button, Reveal, assistant/*
src/lib/          experience.tsx (intro state + Lenis), sceneStore.ts (DOM ↔ WebGL state), hooks
```

Accessibility & performance: reduced-motion disables the intro, pinning and smooth scroll; WebGL fallback; adaptive quality (fewer particles, no bloom on low-power devices); the domain canvas stops rendering when off-screen.
