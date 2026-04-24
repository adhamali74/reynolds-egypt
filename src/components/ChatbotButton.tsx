import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

type Msg = { from: "bot" | "user"; text: string };

export default function ChatbotButton() {
  const t = useT();
  const intro: Msg[] = useMemo(
    () => [{ from: "bot", text: t("chat.intro") }],
    [t]
  );
  const quick = useMemo(
    () => [
      t("chat.quick.quote"),
      t("chat.quick.lanes"),
      t("chat.quick.customs"),
      t("chat.quick.contact"),
    ],
    [t]
  );

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(intro);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep intro message in sync if language changes while panel is idle
  useEffect(() => {
    setMessages((m) =>
      m.length <= 1 && m[0]?.from === "bot" ? intro : m
    );
  }, [intro]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  // Reply routing — matches key phrases in BOTH English + Arabic so the bot
  // stays useful in either language without needing a real NLU backend.
  const botReply = (prompt: string): string => {
    const p = prompt.toLowerCase();
    const has = (...needles: string[]) => needles.some((n) => p.includes(n));
    if (has("quote", "price", "rate", "سعر", "عرض", "تسعير")) {
      return t("chat.reply.quote");
    }
    if (has("customs", "clear", "duty", "جمار", "تخليص")) {
      return t("chat.reply.customs");
    }
    if (has("lane", "route", "port", "خط", "ميناء", "مسار")) {
      return t("chat.reply.lanes");
    }
    if (has("contact", "human", "call", "email", "تواصل", "بريد", "اتصال")) {
      return t("chat.reply.contact");
    }
    if (has("warehouse", "storage", "3pl", "تخزين", "مستودع")) {
      return t("chat.reply.warehouse");
    }
    if (has("hi", "hello", "hey", "مرحب", "أهل", "سلام")) {
      return t("chat.reply.hi");
    }
    return t("chat.reply.fallback");
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { from: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: botReply(trimmed) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed bottom-24 right-6 z-[60] flex h-[540px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900/95 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="relative flex items-center gap-2.5 border-b border-white/10 bg-gradient-to-r from-magenta-500/20 to-royal-500/20 p-4">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <img
                  src="/assets/logo-icon.png"
                  alt="Reynolds"
                  className="h-6 w-6 object-contain"
                  draggable={false}
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{t("chat.title")}</div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/50">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                  {t("chat.status")}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("chat.close")}
                className="rounded-full p-1 text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "bg-gradient-to-br from-magenta-500 to-royal-500 text-white"
                        : "bg-white/[0.04] text-white/85"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/60">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:240ms]" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick chips */}
            {messages.length <= intro.length && (
              <div className="flex flex-wrap gap-2 border-t border-white/5 px-4 py-3">
                {quick.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/70 transition hover:border-magenta-500/40 hover:bg-magenta-500/10 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-black/20 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-magenta-500/60 focus:outline-none"
              />
              <button
                type="submit"
                aria-label={t("chat.send")}
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-magenta-500 to-royal-500 text-white transition disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("chat.close") : t("chat.open")}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.6 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-[61] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-magenta-500 to-royal-500 text-white shadow-[0_20px_60px_-10px_rgba(230,1,122,0.5)]"
      >
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-magenta-500/30" />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
