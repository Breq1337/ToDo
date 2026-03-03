"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Info } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";

type Message = { role: "user" | "assistant"; content: string };

export function TutorChat() {
  const { locale } = useLocale();
  const t = getPortalContent(locale).tutor;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      const { getIdToken } = await import("@/lib/authClient");
      const token = await getIdToken(false);
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/portal/tutor", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();

      if (data.error === "AI_UNAVAILABLE") {
        setMessages((m) => [...m, { role: "assistant", content: t.unavailable }]);
        return;
      }

      const reply = data.reply ?? (data.error ? `Erro: ${data.error}` : "Sem resposta.");
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: t.unavailable },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl flex flex-col h-[calc(100vh-12rem)]">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-xl font-bold text-foreground mb-4"
      >
        {t.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        role="alert"
        className="mb-4 flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground"
      >
        <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden />
        <p className="text-muted-foreground">{t.disclaimer}</p>
      </motion.div>

      <div className="flex-1 rounded-2xl border border-border bg-surface2/30 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t.placeholder}
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.role === "user" ? "text-right" : "text-left"}
            >
              <span
                className={
                  msg.role === "user"
                    ? "inline-block rounded-xl bg-primary/15 text-foreground px-4 py-2 text-sm"
                    : "inline-block rounded-xl bg-surface2 text-foreground px-4 py-2 text-sm"
                }
              >
                {msg.content}
              </span>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Pensando…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="p-4 border-t border-border flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary-hover disabled:opacity-50 transition-colors"
            aria-label={t.send}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
