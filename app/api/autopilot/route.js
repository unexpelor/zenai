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
Berdasarkan data UMKM berikut, buat strategi bisnis selama ${duration} hari.

DATA BISNIS:
${JSON.stringify(body.business)}

Balas HANYA dengan JSON valid.
Jangan gunakan markdown.
Jangan gunakan \`\`\`json.
Jangan menambahkan penjelasan sebelum atau sesudah JSON.

Format JSON:

{
  "mission": {
    "title": "",
    "target": "",
    "duration": "${duration} hari",
    "priority": "HIGH"
  },
  "actions": [
    {
      "id": 1,
      "title": "",
      "type": "CONTENT",
      "description": "",
      "output": ""
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
            "Anda adalah Business Autopilot untuk UMKM Indonesia. Balas hanya JSON valid tanpa markdown dan tanpa teks tambahan."
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          message: data.message || "AI Router gagal",
          details: data.details || [],
          raw: data
        },
        {
          status: response.status
        }
      );
    }

    if (!data.text) {
      return Response.json(
        {
          message: "AI tidak mengembalikan respons."
        },
        {
          status: 500
        }
      );
    }

    let cleanJson = data.text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleanJson.indexOf("{");
    const end = cleanJson.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return Response.json(
        {
          message: "AI tidak mengembalikan JSON valid.",
          raw: data.text
        },
        {
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
