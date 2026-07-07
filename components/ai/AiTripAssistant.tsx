"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Send, MessageCircle, Bot, Loader2, Sparkles } from "lucide-react";
import { buildWhatsAppMessage } from "@/lib/whatsapp";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type TourRef = {
  slug: string;
  title: string;
};

const WELCOME: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy tu asistente de viajes para Medellín. Cuéntame qué tipo de experiencia buscas — aventura, cultura, gastronomía, naturaleza — y te recomiendo los mejores tours.",
};

function parseTourRefs(text: string): TourRef[] {
  const refs: TourRef[] = [];
  const regex = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    refs.push({ slug: match[1], title: match[2] });
  }
  return refs;
}

function renderMessage(text: string) {
  return text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");
}

function TourCard({ slug, title }: TourRef) {
  return (
    <a
      href={`/tours/${slug}`}
      className="mt-2 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 font-body text-sm text-primary hover:bg-primary/10 transition-colors"
    >
      <Sparkles className="size-3.5 shrink-0" />
      <span className="font-medium">{title}</span>
    </a>
  );
}

export function AiTripAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const getWhatsAppUrl = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const tours = parseTourRefs(
      messages
        .filter((m) => m.role === "assistant")
        .map((m) => m.content)
        .join(" ")
    );
    const { whatsappUrl } = buildWhatsAppMessage({
      selectedTours: tours.map((t) => ({ title: t.title })),
      source: `Asistente IA — "${lastUser?.content ?? "consulta general"}"`,
    });
    return whatsappUrl;
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    setInput("");

    const history: Message[] = [...messages, { role: "user", content: userText }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) throw new Error();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Lo siento, tuve un problema. Por favor intenta de nuevo.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  const lastAssistant = messages[messages.length - 1];
  const showWhatsApp =
    !isStreaming &&
    messages.length > 1 &&
    lastAssistant.role === "assistant" &&
    lastAssistant.content.length > 0;

  const lastTourRefs = parseTourRefs(
    messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content)
      .at(-1) ?? ""
  );

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-body text-sm font-medium text-white shadow-lg shadow-primary/30"
            aria-label="Abrir asistente de viajes"
          >
            <Bot className="size-4" />
            Asistente IA
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 flex h-[580px] w-[370px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/20 max-sm:bottom-0 max-sm:right-0 max-sm:h-[90dvh] max-sm:w-full max-sm:rounded-b-none"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between bg-[#0D1B3D] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                  <Bot className="size-4 text-white" />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-white">Asistente de Viajes</p>
                  <p className="font-body text-xs text-[#A8CBE6]">Medellín Trip Planner</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/50 transition-colors hover:text-white"
                aria-label="Cerrar chat"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#F1F3F6] p-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-primary text-white"
                          : "rounded-bl-sm bg-white text-[#0D1B3D] shadow-sm"
                      }`}
                    >
                      {msg.content ? (
                        renderMessage(msg.content)
                      ) : (
                        <span className="flex items-center gap-1 py-0.5">
                          <span className="size-1.5 rounded-full bg-current animate-bounce" />
                          <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:0.15s]" />
                          <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:0.3s]" />
                        </span>
                      )}
                    </div>

                    {/* Tour cards inline with last assistant message */}
                    {msg.role === "assistant" &&
                      i === messages.length - 1 &&
                      !isStreaming &&
                      lastTourRefs.length > 0 && (
                        <div className="mt-1 flex w-full max-w-[85%] flex-col gap-1">
                          {lastTourRefs.map((ref) => (
                            <TourCard key={ref.slug} {...ref} />
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {/* WhatsApp CTA */}
                {showWhatsApp && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex"
                  >
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-[#1eb855]"
                    >
                      <MessageCircle className="size-4" />
                      Reservar por WhatsApp
                    </a>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-gray-100 bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="¿Qué experiencia buscas?"
                  disabled={isStreaming}
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-[#F1F3F6] px-4 py-2.5 font-body text-sm outline-none transition-colors focus:border-primary disabled:opacity-60"
                />
                <button
                  onClick={sendMessage}
                  disabled={isStreaming || !input.trim()}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-40"
                  aria-label="Enviar"
                >
                  {isStreaming ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-center font-body text-[10px] text-gray-400">
                Potenciado por IA · Las reservas se confirman por WhatsApp
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
