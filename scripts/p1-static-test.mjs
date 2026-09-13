import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const page = read("app/page.js");
const ai = read("app/api/ai/route.js");
const autopilot = read("app/api/autopilot/route.js");
const health = read("app/api/health/route.js");
const testing = read("doc/05_TESTING.md");
const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));

const checks = [];
const check = (name, condition) => checks.push({ name, pass: Boolean(condition) });

check("T01-T25 test cases exist", Array.from({length:25}, (_,i) => `T${String(i+1).padStart(2,"0")}`).every(id => testing.includes(`| ${id} |`)));
check("Autopilot uses dedicated endpoint", page.includes('fetch("/api/autopilot"'));
check("Autopilot schema validation exists", autopilot.includes("validateAutopilotResult"));
check("Autopilot action count bounded", autopilot.includes("actions.length > duration"));
check("AI Groq timeout", ai.includes("AbortSignal.timeout(30000)"));
check("AI Gemini timeout", ai.includes("Gemini request timeout"));
check("Health missing provider semantics", health.includes('"not_configured"'));
check("Supabase lock alignment", lock.packages?.["node_modules/@supabase/supabase-js"]?.version === "2.57.4" && pkg.dependencies?.["@supabase/supabase-js"] === "^2.57.4");
check("Media cleared after analysis", page.includes("setImage(\"\")") && page.includes("setAudio(\"\")"));
check("Dark theme dataset", page.includes('document.documentElement.dataset.theme'));
check("Finance cash movement", page.includes("result.cashChange = result.cashIn - result.cashOut"));
check("API auth enforced", ai.includes("requireApiUser") && autopilot.includes("requireApiUser"));
check("Payload limits", ai.includes("8_000_000") && ai.includes("12_000_000"));
check("Rate limiting", ai.includes("rateLimit") && autopilot.includes("rateLimit"));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`RESULT: ${checks.length - failed.length}/${checks.length} static checks passed`);
if (failed.length) process.exitCode = 1;
