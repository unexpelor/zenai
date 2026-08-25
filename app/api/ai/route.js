import { GoogleGenerativeAI } from "@google/generative-ai";

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
// =========================

async function gemini(
  prompt,
  image,
  imageMimeType,
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

    const jsonMode =
      wantsJson(
        system,
        prompt
      );

    const providers =
      hasImage
        ? [
            "gemini",
            "groq",
            "openrouter",
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

        if (
          provider === "gemini"
        ) {
          const result =
            await gemini(
              prompt,
              body.image,
              body.imageMimeType,
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
