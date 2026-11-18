import { site } from "@/data/site";

export type Inquiry = {
  name: string;
  email: string;
  affiliation: string;
  role: string;
  message: string;
  /** Honeypot — real people leave it empty. */
  website: string;
};

export class InquiryError extends Error {
  constructor(
    message: string,
    /** true when the form inbox still needs its one-time activation. */
    public needsActivation = false,
  ) {
    super(message);
  }
}

/**
 * Sends a PhD inquiry to the site owner's inbox through a form service
 * (GitHub Pages has no backend). Provider is chosen in `site.phd.form`.
 */
export async function sendInquiry(data: Inquiry): Promise<void> {
  if (data.website) return; // bot: pretend success
  const to = site.contact.email;
  const { provider, web3formsKey } = site.phd.form;
  const subject = `PhD inquiry — ${data.name || data.email}${data.affiliation ? ` (${data.affiliation})` : ""}`;

  const fields = {
    Name: data.name,
    Email: data.email,
    Affiliation: data.affiliation || "—",
    "I am a": data.role || "—",
    Message: data.message || "—",
  };

  let res: Response;
  if (provider === "web3forms" && web3formsKey) {
    res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: web3formsKey, subject, from_name: `${site.name.first} ${site.name.last} — portfolio`, replyto: data.email, ...fields }),
    });
  } else {
    if (!to) throw new InquiryError("No destination email configured.");
    res = await fetch(`https://formsubmit.co/ajax/${to}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: subject, _replyto: data.email, _template: "table", _captcha: "false", ...fields }),
    });
  }

  const json = (await res.json().catch(() => ({}))) as { success?: boolean | string; message?: string };
  const ok = res.ok && String(json.success) === "true";
  if (!ok) {
    const msg = json.message ?? `Request failed (${res.status})`;
    throw new InquiryError(msg, /activat/i.test(msg));
  }
}

/** Pre-filled mailto: link used as a fallback when the service fails. */
export function inquiryMailto(data: Partial<Inquiry>) {
  const to = site.contact.email ?? "";
  const subject = encodeURIComponent(`PhD inquiry${data.name ? ` — ${data.name}` : ""}`);
  const body = encodeURIComponent(
    [data.message, "", data.name, data.affiliation, data.email].filter((l) => l !== undefined).join("\n"),
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
