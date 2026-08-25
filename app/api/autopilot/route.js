export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.business) {
      return Response.json(
        {
          message: "Data bisnis tidak tersedia."
        },
        {
          status: 400
        }
      );
    }

    const duration = body.duration || 7;

    const prompt = `
Buat strategi bisnis UMKM selama ${duration} hari berdasarkan data berikut:

${JSON.stringify(body.business)}

Balas HANYA dengan satu objek JSON valid.
Jangan gunakan markdown.
Jangan gunakan teks sebelum atau sesudah JSON.

Format:

{
  "mission": {
    "title": "Judul strategi",
    "target": "Target utama",
    "duration": "${duration} hari",
    "priority": "HIGH"
  },
  "actions": [
    {
      "id": 1,
      "title": "Judul aksi",
      "type": "CONTENT",
      "description": "Penjelasan aksi",
      "output": "Hasil yang diharapkan"
    }
  ]
}
`;

    const response = await fetch(
      new URL("/api/ai", req.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          system:
            "Anda adalah AI Business Autopilot untuk UMKM Indonesia. Balas hanya JSON valid tanpa markdown atau teks tambahan."
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          message: data.message || "AI Router gagal",
          details: data.details || []
        },
        {
          status: response.status
        }
      );
    }

    if (!data.text || typeof data.text !== "string") {
      return Response.json(
        {
          message: "AI tidak mengembalikan respons."
        },
        {
          status: 500
        }
      );
    }

    const raw = data.text;

    let cleanJson = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleanJson.indexOf("{");

    if (start === -1) {
      return Response.json(
        {
          message: "Output AI tidak mengandung JSON.",
          raw
        },
        {
          status: 500
        }
      );
    }

    let depth = 0;
    let end = -1;
    let inString = false;
    let escaped = false;

    for (let i = start; i < cleanJson.length; i++) {
      const char = cleanJson[i];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === '"') {
          inString = false;
        }

        continue;
      }

      if (char === '"') {
        inString = true;
      } else if (char === "{") {
        depth++;
      } else if (char === "}") {
        depth--;

        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }

    if (end === -1) {
      return Response.json(
        {
          message: "JSON dari AI tidak lengkap.",
          raw
        },
        {
          status: 500
        }
      );
    }

    const jsonText = cleanJson.substring(start, end);

    let result;

    try {
      result = JSON.parse(jsonText);
    } catch (error) {
      return Response.json(
        {
          message: "JSON AI tidak valid.",
          error: error.message,
          raw,
          jsonText
        },
        {
          status: 500
        }
      );
    }

    return Response.json({
      result,
      provider: data.provider
    });

  } catch (error) {
    console.error("AUTOPILOT ERROR:", error);

    return Response.json(
      {
        message: error.message || "Autopilot gagal dijalankan."
      },
      {
        status: 500
      }
    );
  }
}    let end = -1;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i++) {
      const char = text[i];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
      } else if (char === "{") {
        depth++;
      } else if (char === "}") {
        depth--;

        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }

    if (end === -1) {
      return Response.json(
        {
          message: "JSON dari AI tidak lengkap.",
          raw
        },
        { status: 500 }
      );
    }

    const jsonText = text.substring(start, end);

    let result;

    try {
      result = JSON.parse(jsonText);
    } catch (error) {
      return Response.json(
        {
          message: "JSON AI tidak valid.",
          error: error.message,
          raw,
          jsonText
        },
        { status: 500 }
      );
    }

    return Response.json({
      result,
      provider: data.provider
    });

  } catch (error) {
    console.error("AUTOPILOT ERROR:", error);

    return Response.json(
      {
        message: error.message || "Autopilot gagal."
      },
      { status: 500 }
    );
  }
}        {
          status: 500
        }
      );
    }

    cleanJson = cleanJson.substring(
      start,
      end + 1
    );

    let result;

    try {
      result = JSON.parse(cleanJson);
    } catch (error) {
      return Response.json(
        {
          message: "JSON dari AI tidak valid.",
          error: error.message,
          raw: data.text
        },
        {
          status: 500
        }
      );
    }

    return Response.json({
      result,
      provider: data.provider
    });

  } catch (error) {

    console.error("AUTOPILOT ERROR:", error);

    return Response.json(
      {
        message: error.message || "Autopilot gagal dijalankan."
      },
      {
        status: 500
      }
    );
  }
}
