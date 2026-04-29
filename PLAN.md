# Teacher Chatbot — Build Plan

Single-page chatbot for Kazakh-speaking high-school computer-science teachers (grades 9–11). Deployed on Render. No database — conversation history lives in the user's browser (`localStorage`). One fixed system prompt baked into the server route.

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15** (App Router, no `src/`) | Single project = Node server + React UI; trivial Render deploy. |
| AI provider | **`@ai-sdk/google`** (direct Gemini) | Keeps the API key server-side. No AI Gateway, no markup. |
| Streaming UI | **`@ai-sdk/react`** `useChat` | Built-in streaming + state. |
| Storage | **`localStorage`** in the browser | No DB, no auth, no users. Each browser keeps its own thread. |
| Styling | **Tailwind CSS** | Built-in via `create-next-app`. |
| Hosting | **Render** Web Service (Docker-free Node) | Free tier OK for demo. Sleeps after 15 min idle. |

## Required environment variables

Only one:

| Var | Source |
|-----|--------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | https://aistudio.google.com/app/apikey (free tier) |

## Planned file layout

```
.
├── app/
│   ├── page.tsx              # Chat UI: useChat + localStorage persistence
│   ├── api/chat/route.ts     # POST: streamText({ model: google(...), system, messages })
│   ├── layout.tsx            # default
│   └── globals.css
├── lib/
│   └── system-prompt.ts      # Kazakh teacher prompt (use SCRIPT.md as reference)
├── package.json
├── next.config.ts
├── tsconfig.json
├── .env.local                # GOOGLE_GENERATIVE_AI_API_KEY=...  (gitignored)
├── .env.example              # template for the above
└── README.md
```

## Implementation steps (for the next conversation)

1. **Bootstrap Next.js**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-pnpm --yes
   ```

2. **Install AI SDK + Gemini**
   ```bash
   pnpm add ai @ai-sdk/google @ai-sdk/react zod
   ```

3. **Add the system prompt** at `lib/system-prompt.ts`. Copy the prompt content from `SCRIPT.md` (the Kazakh teacher scenario). Export as a plain string constant.

4. **Server route** at `app/api/chat/route.ts` — ~15 lines:
   ```ts
   import { google } from "@ai-sdk/google";
   import { streamText, convertToModelMessages, type UIMessage } from "ai";
   import { systemPrompt } from "@/lib/system-prompt";

   export async function POST(req: Request) {
     const { messages }: { messages: UIMessage[] } = await req.json();
     const result = streamText({
       model: google("gemini-2.5-flash"),
       system: systemPrompt,
       messages: convertToModelMessages(messages),
     });
     return result.toUIMessageStreamResponse();
   }
   ```

5. **Client page** at `app/page.tsx` — ~80 lines:
   - `useChat` from `@ai-sdk/react` for streaming.
   - On mount: rehydrate `messages` from `localStorage["chat-history"]`.
   - On every `messages` change: write back to `localStorage`.
   - Render message bubbles + input form.
   - Add a "Clear chat" button that empties `localStorage` and resets state.

6. **`.env.local`** with `GOOGLE_GENERATIVE_AI_API_KEY=…`. Add to `.gitignore` (Next default already does this).

7. **Local test**: `pnpm dev` → http://localhost:3000 → ask a question in Kazakh.

8. **Push to GitHub.**

9. **Deploy on Render**:
   - New → Web Service → connect the repo.
   - Runtime: **Node**.
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Add env var: `GOOGLE_GENERATIVE_AI_API_KEY`.
   - Free instance type is fine. Auto-deploy on push.

## What we explicitly do NOT include

- No Postgres, no Redis, no Blob storage.
- No auth, no users, no login flow.
- No multi-conversation sidebar — one continuous thread per browser.
- No file uploads, no images, no artifacts/code editor.
- No model picker — Gemini 2.5 Flash hard-coded.

## System prompt scope

Defined in `lib/system-prompt.ts`. Covers the five categories from `SCRIPT.md`:
1. Curriculum questions (9–11 grade CS topics)
2. Exam preparation (final + ЕНТ)
3. Administrative questions (grades, olympiads)
4. Methodological recommendations
5. Test/task creation

Replies in Kazakh by default; mirrors user's language if they switch to Russian or English.

## Estimated effort

- Bootstrap → working local chat: ~30 min.
- Render deploy: ~10 min.
- Total: under an hour.
