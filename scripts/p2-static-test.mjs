import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const files = {
  page: read("app/page.js"),
  ai: read("app/api/ai/route.js"),
  autopilot: read("app/api/autopilot/route.js"),
  marketplace: read("app/api/marketplace/route.js"),
  health: read("app/api/health/route.js"),
  security: read("lib/api-security.js"),
  css: read("app/globals.css"),
  next: read("next.config.mjs"),
  testing: read("doc/05_TESTING.md"),
};

const checks = [];
const check = (name, condition) => checks.push({ name, pass: Boolean(condition) });

check("25 test cases documented", Array.from({ length: 25 }, (_, i) => `| T${String(i + 1).padStart(2, "0")} |`).every(id => files.testing.includes(id)));
check("Autopilot dedicated endpoint", files.page.includes('fetch("/api/autopilot"'));
check("Autopilot schema validation", files.autopilot.includes("validateAutopilotResult"));
check("Autopilot timeout", files.autopilot.includes("AbortSignal.timeout(30000)"));
check("AI Groq/OpenRouter timeout", (files.ai.match(/AbortSignal\.timeout\(30000\)/g) || []).length >= 2);
check("AI Gemini timeout", files.ai.includes("Gemini request timeout"));
check("Marketplace Tavily timeout", files.marketplace.includes("AbortSignal.timeout(7000)"));
check("Marketplace AI timeout", files.marketplace.includes("AbortSignal.timeout(30000)"));
check("API auth", files.ai.includes("requireApiUser") && files.autopilot.includes("requireApiUser") && files.marketplace.includes("requireApiUser"));
check("Rate limit bucket pruning", files.security.includes("MAX_BUCKETS") && files.security.includes("pruneBuckets"));
check("Security headers", files.next.includes("X-Content-Type-Options") && files.next.includes("Referrer-Policy"));
check("Dark theme dataset", files.page.includes("dataset.theme"));
check("Reduced motion support", files.css.includes("prefers-reduced-motion"));
check("Mobile touch input sizing", files.css.includes("max-width: 640px") && files.css.includes("font-size: 16px"));
check("Finance cash movement regression code", files.page.includes("result.cashChange = result.cashIn - result.cashOut"));
check("Media cleared after analysis", files.page.includes('setImage("")') && files.page.includes('setAudio("")'));
check("No unsafe HTML injection", !files.page.includes("dangerouslySetInnerHTML") && !files.page.includes("innerHTML"));
check("Health not-configured semantics", files.health.includes('"not_configured"'));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter(item => !item.pass);
console.log(`RESULT: ${checks.length - failed.length}/${checks.length} P2 static checks passed`);
if (failed.length) process.exitCode = 1;
