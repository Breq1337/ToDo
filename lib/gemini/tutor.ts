/**
 * Green Tutor — chat with Gemini Flash. Server-side only.
 */

import { getTutorSystemPrompt } from "@/content/aiPrompts/tutor";

const GEMINI_FLASH_MODEL = process.env.GEMINI_FLASH_MODEL || "gemini-2.5-flash";

type HistoryItem = { role: "user" | "assistant"; content: string };

export async function getTutorReply(params: {
  message: string;
  history: HistoryItem[];
  locale: string;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "O Tutor Green está temporariamente indisponível. Configure GEMINI_API_KEY.";
  }

  const systemPrompt = getTutorSystemPrompt(params.locale);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_FLASH_MODEL}:generateContent?key=${apiKey}`;

  // Gemini API: contents[].role is "user" | "model", parts[].text
  const contents = [
    ...params.history.slice(-10).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: params.message }] },
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Gemini Tutor]", res.status, err);
    return "Não foi possível obter resposta. Tente novamente em instantes.";
  }

  const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || "Sem resposta.";
}
