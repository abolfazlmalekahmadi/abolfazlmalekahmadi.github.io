import { site } from "@/data/site";

/** Personal mark: AM monogram + surname wordmark. */
export default function Brand({ showRole = false, dim = false }: { showRole?: boolean; dim?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-cyan/50 bg-cyan/10 shadow-[0_0_14px_rgb(85_223_255/0.25)]">
        <span className="absolute inset-[3px] rounded-full border border-cyan/20" />
        <span className="font-display text-[11px] font-semibold tracking-[0.04em] text-cyan">{site.monogram}</span>
      </span>
      <span className={`font-display text-[13px] font-semibold tracking-[0.3em] ${dim ? "text-ink/80" : "text-ink"}`}>{site.brand}</span>
      {showRole && <span className="hidden font-mono text-[10px] tracking-[0.2em] text-mute xl:inline">/ {site.role}</span>}
    </span>
  );
}
