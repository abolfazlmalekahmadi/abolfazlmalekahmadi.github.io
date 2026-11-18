"use client";

import type { ReactNode } from "react";
import Magnetic from "./Magnetic";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  icon?: ReactNode;
  cursor?: string;
  external?: boolean;
  download?: boolean;
  className?: string;
};

/** Magnetic pill button. Renders <a> when `href` is given, otherwise <button>. */
export default function Button({ children, href, onClick, variant = "primary", icon, cursor, external, download, className }: Props) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500";
  const styles =
    variant === "primary"
      ? "bg-ink text-bg hover:text-bg"
      : "border border-ink/20 text-ink hover:border-cyan/70 hover:text-cyan";
  const inner = (
    <>
      {variant === "primary" && (
        <span className="absolute inset-0 -translate-x-[101%] bg-cyan transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
      )}
      <span className="relative">{children}</span>
      {icon && <span className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-1">{icon}</span>}
    </>
  );
  return (
    <Magnetic>
      {href ? (
        <a
          href={href}
          onClick={onClick}
          className={`${base} ${styles} ${className ?? ""}`}
          data-cursor={cursor}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...(download ? { download: "" } : {})}
        >
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={`${base} ${styles} ${className ?? ""}`} data-cursor={cursor}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
