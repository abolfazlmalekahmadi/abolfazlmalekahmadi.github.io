/** Brand marks (not in lucide). Simple, single-colour, 24×24. */
type P = { className?: string; size?: number };

export const LinkedInIcon = ({ className, size = 16 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h3.96V21H3V9.75Zm6.5 0h3.8v1.54h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.74 2.63 4.74 6.06V21h-3.95v-5.07c0-1.21-.02-2.77-1.69-2.77-1.69 0-1.95 1.32-1.95 2.68V21H9.5V9.75Z" />
  </svg>
);

export const GitHubIcon = ({ className, size = 16 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

export const ScholarIcon = ({ className, size = 16 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
    <path d="M12 3 1 9.5l4 2.36V17c0 .4.24.77.6.93C7.3 18.7 9.6 19.5 12 19.5s4.7-.8 6.4-1.57c.36-.16.6-.53.6-.93v-5.14l2-1.18V16h1.5V9.5L12 3Zm0 2.3 7.93 4.7L12 14.7 4.07 10 12 5.3Z" />
  </svg>
);
