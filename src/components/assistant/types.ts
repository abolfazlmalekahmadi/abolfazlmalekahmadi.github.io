export type Source = { label: string; href: string };

export type AssistantReply = { text: string; sources: Source[] };

export type ChatMessage = { role: "user" | "assistant"; text: string; sources?: Source[] };

/**
 * Anything that can answer a question. Swap the provider to go live:
 * the UI does not care where answers come from.
 */
export interface AssistantProvider {
  readonly id: string;
  /** true → backed by a real language model. */
  readonly live: boolean;
  ask(question: string, history: ChatMessage[]): Promise<AssistantReply>;
}
