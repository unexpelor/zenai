import { GoogleGenerativeAI } from "@google/generative-ai";

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
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY tidak dikonfigurasi"
    );
  }

  const body = {
    model:
      process.env.OPENROUTER_MODEL ||
      "google/gemma-4-26b-a4b-it:free",

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
          `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },

      body: JSON.stringify(body),
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

  const result =
    await model.generateContent({
      contents: [
        {
          role: "user",
          parts,
        },
      ],

      generationConfig,
    });

  const text =
    result.response.text();

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
  try {
    const body =
      await request.json();

    const prompt =
      body.prompt || "";

    const system =
      body.system ||
      "Anda adalah AI bisnis yang membantu UMKM Indonesia.";

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
    // Groq → OpenRouter → Gemini
    //
    // IMAGE / AUDIO:
    // Gemini
    // =========================

    const providers =
      hasMedia
        ? [
            "gemini",
          ]
        : [
            "groq",
            "openrouter",
            "gemini",
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
            result
          );
        }

        // =====================
        // OPENROUTER
        // =====================

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
            result
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
            result
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
        message:
          "Semua provider gagal.",

        details:
          errors,

        configured: {
          groq: Boolean(
            process.env.GROQ_API_KEY
          ),

          gemini: Boolean(
            process.env.GEMINI_API_KEY
          ),

          openrouter: Boolean(
            process.env.OPENROUTER_API_KEY
          ),
        },
      },
      {
        status: 503,
      }
    );

  } catch (error) {
    console.error(
      "AI ROUTER FATAL ERROR:",
      error
    );

    return Response.json(
      {
        message:
          error.message ||
          "AI Router gagal.",

        error:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
        }
