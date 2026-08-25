export async function POST(req) {
  try {
    const body = await req.json();

    const prompt = `
Buat strategi bisnis UMKM selama ${body.duration || 7} hari.

DATA BISNIS:
${JSON.stringify(body.business)}

Balas HANYA dalam format JSON valid:

{
  "mission": {
    "title": "Judul strategi",
    "target": "Target utama",
    "duration": "${body.duration || 7} hari",
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
          prompt: prompt,
          system: "Anda adalah Business Autopilot UMKM. Balas hanya JSON valid tanpa markdown."
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          message: data.message || "AI gagal",
          details: data.details || []
        },
        {
          status: response.status
        }
      );
    }

    const raw = String(data.text || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return Response.json(
        {
          message: "AI tidak menghasilkan JSON.",
          raw: raw
        },
        {
          status: 500
        }
      );
    }

    const jsonText = raw.slice(start, end + 1);

    try {
      const result = JSON.parse(jsonText);

      return Response.json({
        result: result,
        provider: data.provider
      });
    } catch (error) {
      return Response.json(
        {
          message: "JSON AI tidak valid.",
          error: error.message,
          raw: raw
        },
        {
          status: 500
        }
      );
    }

  } catch (error) {
    return Response.json(
      {
        message: error.message || "Autopilot gagal."
      },
      {
        status: 500
      }
    );
  }
}
