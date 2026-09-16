import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonError, rateLimit, requireApiUser } from "../../../lib/api-security";

// =========================
// DETECT JSON MODE
// =========================

function wantsJson(system = "", prompt = "") {
  const text = `${system}\n${prompt}`.toLowerCase();

  return (
    text.includes("json") &&
    (
      text.includes("hanya") ||
      text.includes("only") ||
      text.includes("valid")
    )
  );
}

// =========================
// GROQ
// TEXT ONLY
// =========================

async function groq(prompt, system, jsonMode = false) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY tidak dikonfigurasi");
  }

  const body = {
    model:
      process.env.GROQ_MODEL ||
      "qwen/qwen3.6-27b",

    messages: [
      {
        role: "system",
        content: system,
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.3,

    max_completion_tokens: 4096,

    reasoning_effort: "none",
  };

  if (jsonMode) {
    body.response_format = {
      type: "json_object",
    };
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${process.env.GROQ_API_KEY}`,
      },

      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      data?.message ||
      "Groq gagal"
    );
  }

  const text =
    data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(
      "Groq tidak mengembalikan konten."
    );
  }

  return {
    text,
    provider: "Groq",
  };
}

// =========================
// OPENROUTER
// TEXT ONLY
// =========================

async function openrouter(
  prompt,
  system,
  jsonMode = false
) {
  if (!process.env.ZENAI_OPENROUTER_FALLBACK_KEY) {
    throw new Error(
      "ZENAI_OPENROUTER_FALLBACK_KEY tidak dikonfigurasi"
    );
  }

  const body = {
    // Last-resort fallback must always use OpenRouter's free router.
    // Do not promote a specific model or a paid model through env config.
    model: "openrouter/free",

    messages: [
      {
        role: "system",
        content: system,
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.3,

    max_tokens: 4096,
  };

  if (jsonMode) {
    body.response_format = {
      type: "json_object",
    };
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${process.env.ZENAI_OPENROUTER_FALLBACK_KEY}`,
      },

      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      data?.message ||
      "OpenRouter gagal"
    );
  }

  const text =
    data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(
      "OpenRouter tidak mengembalikan konten."
    );
  }

  return {
    text,
    provider: "OpenRouter",
  };
}

// =========================
// GEMINI
// TEXT + IMAGE + AUDIO
// =========================

async function gemini(
  prompt,
  image,
  imageMimeType,
  audio,
  audioMimeType,
  system,
  jsonMode = false
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY tidak dikonfigurasi"
    );
  }

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model:
      process.env.GEMINI_MODEL ||
      "gemini-3.5-flash-lite",
  });

  const parts = [
    {
      text: `${system}\n\n${prompt}`,
    },
  ];

  // =========================
  // IMAGE
  // =========================

  if (image) {
    parts.push({
      inlineData: {
        data: image.includes(",")
          ? image.split(",")[1]
          : image,

        mimeType:
          imageMimeType ||
          "image/jpeg",
      },
    });
  }

  // =========================
  // AUDIO / VOICE NOTE
  // =========================

  if (audio) {
    parts.push({
      inlineData: {
        data: audio.includes(",")
          ? audio.split(",")[1]
          : audio,

        mimeType:
          audioMimeType ||
          "audio/webm",
      },
    });
  }

  const generationConfig = {
    temperature: 0.3,

    maxOutputTokens: 4096,
  };

  if (jsonMode) {
    generationConfig.responseMimeType =
      "application/json";
  }

  const generationPromise = model.generateContent({
    contents: [
      {
        role: "user",
        parts,
      },
    ],
    generationConfig,
  });

  const result = await Promise.race([
    generationPromise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini request timeout")), 30000)
    ),
  ]);

  const text = result.response.text();

  if (!text) {
    throw new Error(
      "Gemini tidak mengembalikan konten."
    );
  }

  return {
    text,
    provider: "Gemini",
  };
}

// =========================
// API ROUTER
// =========================

export async function POST(request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return jsonError(auth.message, auth.status);

  const limited = rateLimit(request, "ai", 20, 60_000, auth.user?.id);
  if (!limited.ok) {
    return jsonError("Terlalu banyak permintaan AI. Silakan coba lagi beberapa saat.", 429, { "Retry-After": String(limited.retryAfter) });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError("Format permintaan tidak valid.", 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonError("Data permintaan tidak valid.", 400);
    }

    const rawPrompt = typeof body.prompt === "string" ? body.prompt : "";
    const rawSystem = typeof body.system === "string" ? body.system : "";
    if (rawPrompt.length > 12000 || rawSystem.length > 12000) {
      return jsonError("Input AI terlalu panjang.", 413);
    }

    if (typeof body.image === "string" && body.image.length > 8_000_000) {
      return jsonError("Ukuran gambar terlalu besar.", 413);
    }
    if (typeof body.audio === "string" && body.audio.length > 12_000_000) {
      return jsonError("Ukuran audio terlalu besar.", 413);
    }

    const requestedLocale = body.locale === "en" ? "en" : "id";
    const outputLanguage =
      body.outputLanguage ||
      (requestedLocale === "en" ? "English" : "Bahasa Indonesia");

    const prompt = `${rawPrompt}\n\nLANGUAGE REQUIREMENT: Return every human-readable value in ${outputLanguage}. JSON property names must remain exactly as requested. Do not mix Indonesian and English. User-provided business names, product names, URLs, source titles, and quoted source text may remain unchanged.`;

    const system = `${
      rawSystem ||
      "Anda adalah AI bisnis yang membantu UMKM Indonesia."
    }\n\nLANGUAGE REQUIREMENT: Respond entirely in ${outputLanguage}. Every generated human-readable sentence, label, explanation, recommendation, status, title, description, and JSON string value must use ${outputLanguage}. Never mix Indonesian and English. Keep JSON keys exactly as requested.`;

    const hasImage =
      Boolean(body.image);

    const hasAudio =
      Boolean(body.audio);

    const hasMedia =
      hasImage || hasAudio;

    const jsonMode =
      body.jsonMode === true ||
      wantsJson(
        system,
        prompt
      );

    // =========================
    // VALIDASI INPUT
    // =========================

    if (
      !prompt.trim() &&
      !hasImage &&
      !hasAudio
    ) {
      return Response.json(
        {
          message:
            "Masukkan teks, gambar, atau voice note.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // PROVIDER PRIORITY
    //
    // TEXT:
    //   Groq → Gemini → OpenRouter (LAST RESORT)
    //
    // IMAGE / AUDIO:
    //   Gemini only. OpenRouter is intentionally NOT used here because
    //   this adapter is text-only and must not silently discard media.
    // =========================

    const providers =
      hasMedia
        ? [
            "gemini",
          ]
        : [
            "groq",
            "gemini",
            "openrouter",
          ];

    const errors = [];

    for (
      const provider of providers
    ) {
      try {

        // =====================
        // GROQ
        // =====================

        if (
          provider === "groq"
        ) {
          const result =
            await groq(
              prompt,
              system,
              jsonMode
            );

          return Response.json(
            { success: true, ...result }
          );
        }

        // =====================
        // OPENROUTER — LAST RESORT ONLY
        // =====================
        // This branch is intentionally after every existing text provider.
        // Never move it ahead of an existing provider.

        if (
          provider === "openrouter"
        ) {
          const result =
            await openrouter(
              prompt,
              system,
              jsonMode
            );

          return Response.json(
            { success: true, ...result }
          );
        }

        // =====================
        // GEMINI
        // =====================

        if (
          provider === "gemini"
        ) {
          const result =
            await gemini(
              prompt,
              body.image,
              body.imageMimeType,
              body.audio,
              body.audioMimeType,
              system,
              jsonMode
            );

          return Response.json(
            { success: true, ...result }
          );
        }

      } catch (error) {
        console.error(
          `${provider} ERROR:`,
          error
        );

        errors.push(
          `${provider}: ${
            error.message ||
            String(error)
          }`
        );
      }
    }

    // =========================
    // ALL PROVIDERS FAILED
    // =========================

    return Response.json(
      {
        success: false,
        message: "Layanan AI sedang tidak tersedia. Silakan coba lagi."
      },
      { status: 503 }
    );

  } catch (error) {
    console.error(
      "AI ROUTER FATAL ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan pada layanan AI."
      },
      { status: 500 }
    );
  }

}
