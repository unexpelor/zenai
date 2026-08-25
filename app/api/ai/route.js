return Response.json(
  {
    message: "Semua provider gagal",
    details: errs,
    configured: {
      groq: !!process.env.GROQ_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY
    }
  },
  { status: 503 }
);
