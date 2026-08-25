import { GoogleGenerativeAI } from "@google/generative-ai";

async function groq(prompt, system) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY tidak dikonfigurasi");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
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
        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Groq gagal");
  }

  return {
    text: data.choices?.[0]?.message?.content,
    provider: "Groq",
  };
}

async function openrouter(prompt, system) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY tidak dikonfigurasi");
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model:
          process.env.OPENROUTER_MODEL ||
          "google/gemma-3-27b-it:free",
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
      }),
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

  return {
    text: data.choices?.[0]?.message?.content,
    provider: "OpenRouter",
  };
}

async function gemini(prompt, image, imageMimeType, system) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY tidak dikonfigurasi");
  }

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
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
        mimeType: imageMimeType || "image/jpeg",
      },
    });
  }

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  });

  return {
    text: result.response.text(),
    provider: "Gemini",
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const prompt = body.prompt || "";

    const system =
      body.system ||
      "Anda adalah AI bisnis yang membantu UMKM Indonesia.";

    const hasImage = Boolean(body.image);

    const providers = hasImage
      ? ["gemini", "groq", "openrouter"]
      : ["groq", "openrouter", "gemini"];

    const errors = [];

    for (const provider of providers) {
      try {
        if (provider === "groq") {
          return Response.json(
            await groq(prompt, system)
          );
        }

        if (provider === "openrouter") {
          return Response.json(
            await openrouter(prompt, system)
          );
        }

        if (provider === "gemini") {
          return Response.json(
            await gemini(
              prompt,
              body.image,
              body.imageMimeType,
              system
            )
          );
        }
      } catch (error) {
        errors.push(
          `${provider}: ${error.message}`
        );
      }
    }

    return Response.json(
      {
        message: "Semua provider gagal",
        details: errors,
        configured: {
          groq: Boolean(process.env.GROQ_API_KEY),
          gemini: Boolean(process.env.GEMINI_API_KEY),
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
    return Response.json(
      {
        message: error.message || "AI Router gagal",
      },
      {
        status: 500,
      }
    );
  }
}
