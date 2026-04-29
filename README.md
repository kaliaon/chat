# Teacher Chatbot (Kazakh UI)

Single-page chatbot for Kazakh-speaking high-school computer-science teachers (grades 9–11). The UI and system prompt are in Kazakh; everything else (code, docs) is English.

Conversation history lives in the browser's `localStorage` — no database, no auth.

## Stack

- **Next.js 15** (App Router) — single project for Node API + React UI
- **`@ai-sdk/google`** + Gemini 2.5 Flash-Lite — direct call from the server route
- **`@ai-sdk/react`** `useChat` — streaming UI
- **localStorage** — per-browser chat history
- **Tailwind CSS**
- **Render** — Web Service deploy target

## Local setup

```bash
pnpm install
cp .env.example .env.local
# put your key in .env.local: GOOGLE_GENERATIVE_AI_API_KEY=...
pnpm dev
```

Open http://localhost:3000.

Get a free key at https://aistudio.google.com/app/apikey.

## Deploy on Render

1. Push the repo to GitHub.
2. Render → New → **Web Service** → connect the repo.
3. Settings:
   - **Runtime:** Node
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
4. Add env var: `GOOGLE_GENERATIVE_AI_API_KEY`.
5. Free instance type is fine (sleeps after ~15 min idle).

Auto-deploys on push.

## Project layout

```
app/
  page.tsx              # Chat UI: useChat + localStorage (Kazakh strings)
  api/chat/route.ts     # POST: streamText({ model: google(...), system, messages })
  layout.tsx            # lang="kk", Kazakh metadata
  globals.css
lib/
  system-prompt.ts      # Kazakh teacher system prompt (covers the 5 SCRIPT.md categories)
```

## Out of scope

- No database (no Postgres / Redis / Blob)
- No auth, no users
- Single thread per browser — no conversation list
- No file uploads / images / artifacts
- No model picker — Gemini 2.5 Flash-Lite is hard-coded
