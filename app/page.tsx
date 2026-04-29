"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "./markdown";

const STORAGE_KEY = "teacher-chat-history";

const SUGGESTIONS = [
  "9-сыныпта төртінші тоқсанда қандай тақырыптар оқытылады?",
  "11-сыныпқа арналған «Мәліметтер базасы» тақырыбы бойынша тест дайындап бер.",
  "10-сыныпқа арналған программалау сабағын қалай қызықты етуге болады?",
  "ҰБТ-ға дайындық үшін тест сұрақтарын қалай тиімді құруға болады?",
];

function messageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function Home() {
  const { messages, sendMessage, setMessages, status, error, stop } = useChat();

  const [input, setInput] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UIMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignored
    }
    setHydrated(true);
  }, [setMessages]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignored
    }
  }, [messages, hydrated]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    if (isBusy) return;
    sendMessage({ text });
  };

  const handleClear = () => {
    if (isBusy) stop();
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignored
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
              Информатика мұғаліміне арналған көмекші
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              9–11 сыныптар үшін сабаққа, емтиханға және әдістемелік мәселелерге көмек
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={messages.length === 0 && !isBusy}
            aria-label="Чатты тазалау"
            title="Чатты тазалау"
            className="shrink-0 rounded-md border border-zinc-300 bg-white p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </div>
      </header>

      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Сәлеметсіз бе, ұстаз!
                </h2>
                <p className="mt-2 text-sm leading-6">
                  Мен 9–11 сынып информатика мұғалімдеріне арналған көмекшімін.
                  Сабақ жоспарын құруға, тест сұрақтарын дайындауға, ҰБТ-ға дайындық
                  бойынша кеңес беруге және әдістемелік сұрақтарға жауап беруге дайынмын.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Мысал сұрақтар
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestion(suggestion)}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left text-sm leading-5 text-zinc-700 transition hover:border-zinc-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                      disabled={isBusy}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
                >
                  <span className="px-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {isUser ? "Сіз" : "Көмекші"}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:text-base sm:leading-7 ${
                      isUser
                        ? "whitespace-pre-wrap bg-blue-600 text-white"
                        : "bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {(() => {
                      const text = messageText(message);
                      if (!text) {
                        return (
                          <span className="italic opacity-70">Жауап дайындалуда…</span>
                        );
                      }
                      return isUser ? text : <Markdown>{text}</Markdown>;
                    })()}
                  </div>
                </div>
              );
            })
          )}

          {status === "submitted" && (
            <div className="flex items-start">
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm dark:bg-zinc-900 dark:text-zinc-400">
                Көмекші ойлануда…
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
              Қате орын алды: жауапты ала алмадық. Кейінірек қайталап көріңіз.
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3 sm:px-6"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            rows={1}
            placeholder="Сұрағыңызды жазыңыз…"
            className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 sm:text-base"
            disabled={isBusy}
          />
          {isBusy ? (
            <button
              type="button"
              onClick={() => stop()}
              className="h-11 shrink-0 rounded-xl bg-zinc-800 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Тоқтату
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-11 shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Жіберу
            </button>
          )}
        </form>
        <p className="mx-auto max-w-3xl px-4 pb-3 text-center text-[11px] text-zinc-400 sm:px-6">
          Жауаптарды жасанды интеллект жасайды. Маңызды шешімдерді қабылдамас бұрын ақпаратты тексеріңіз.
        </p>
      </footer>
    </div>
  );
}
