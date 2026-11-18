import { buildKnowledge, type Fact } from "./knowledge";
import type { AssistantProvider, AssistantReply, ChatMessage } from "./types";

const STOP = new Set(["the", "a", "an", "is", "are", "of", "on", "in", "to", "and", "what", "how", "does", "do", "your", "you", "his", "he", "about", "me", "tell", "with", "for", "can", "i"]);

/**
 * OFFLINE provider — no language model involved.
 * Scores verified facts by keyword overlap and returns the best matches verbatim.
 */
export class LocalKnowledgeProvider implements AssistantProvider {
  readonly id = "local";
  readonly live = false;
  private facts: Fact[] = buildKnowledge();

  async ask(question: string): Promise<AssistantReply> {
    const q = question.toLowerCase();
    const tokens = q.split(/[^a-z0-9+]+/).filter((t) => t && !STOP.has(t));
    const scored = this.facts
      .map((f) => {
        let s = 0;
        for (const k of f.keywords) {
          if (k.includes(" ") ? q.includes(k) : tokens.includes(k)) s += 3;
          else if (tokens.some((t) => t.length > 3 && (k.startsWith(t) || t.startsWith(k)))) s += 1;
        }
        return { f, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);

    await new Promise((r) => setTimeout(r, 450));

    if (!scored.length) {
      return {
        text: "I can only answer from the verified information on this site, and I couldn't find a match. Try asking about research interests, PanSAM, the Scientific Reports paper, agents, publications, education or how to get in touch.",
        sources: [],
      };
    }
    const top = scored.slice(0, scored[1] && scored[1].s >= scored[0].s * 0.8 ? 2 : 1).map((x) => x.f);
    const sources = top.flatMap((f) => f.sources).filter((s, i, arr) => arr.findIndex((o) => o.href === s.href) === i);
    return { text: top.map((f) => f.text).join("\n\n"), sources: sources.slice(0, 4) };
  }
}

/**
 * LIVE provider — POSTs to your own endpoint (e.g. a serverless function that
 * calls an LLM grounded on the same knowledge). GitHub Pages is static, so the
 * endpoint must live elsewhere. Expected response: { text, sources: [{label, href}] }.
 */
export class RemoteProvider implements AssistantProvider {
  readonly id = "remote";
  readonly live = true;
  constructor(private endpoint: string) {}

  async ask(question: string, history: ChatMessage[]): Promise<AssistantReply> {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history: history.slice(-8) }),
    });
    if (!res.ok) throw new Error(`Assistant endpoint returned ${res.status}`);
    const data = (await res.json()) as AssistantReply;
    return { text: data.text, sources: Array.isArray(data.sources) ? data.sources : [] };
  }
}

/** Set NEXT_PUBLIC_ASSISTANT_ENDPOINT at build time to switch to the live provider. */
export function createProvider(): AssistantProvider {
  const endpoint = process.env.NEXT_PUBLIC_ASSISTANT_ENDPOINT;
  return endpoint ? new RemoteProvider(endpoint) : new LocalKnowledgeProvider();
}
