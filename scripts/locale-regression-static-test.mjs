import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const page = read("app/page.js");
const layout = read("app/layout.js");
const switcher = read("components/LanguageSwitcher.jsx");
const provider = read("providers/ZenLocaleProvider.jsx");
const sidebar = read("components/Sidebar.jsx");
const checks = [];
const check = (name, condition) => checks.push({ name, pass: Boolean(condition) });

check("No reload-based locale switching", !page.includes("window.location.reload") && !switcher.includes("window.location.reload") && !sidebar.includes("window.location.reload"));
check("Reactive locale provider", layout.includes("ZenLocaleProvider") && provider.includes("NextIntlClientProvider") && provider.includes("setLocaleState"));
check("Locale persisted in cookie", provider.includes("NEXT_LOCALE=") && provider.includes("Max-Age=31536000"));
check("Canonical AI source exists", page.includes("aiCanonicalRef") && page.includes("canonicalValueForSave"));
check("Latest locale wins", page.includes("aiSyncGenerationRef") && page.includes("generation !== aiSyncGenerationRef.current"));
check("Abort stale translations", page.includes("new AbortController()") && page.includes("controller.abort()"));
check("Cache uses source hash + locale", page.includes("_${sourceHash}_${locale}_"));
check("New AI states are registered", page.includes('registerCanonicalAi("growthActions"') && page.includes("lastPresentationHash"));
check("Persisted AI source locale metadata", page.includes("aiSourceLocales") && page.includes("saved.aiSourceLocales"));
check("Dashboard state normalization", page.includes("normalizePulse") && page.includes("normalizeDiagnosis") && page.includes("normalizeMarket") && page.includes("normalizeAutopilot"));
check("Corrupt tab cannot select invalid UI", page.includes("validTabs.has(saved.tab)"));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`RESULT: ${checks.length - failed.length}/${checks.length} localization regression checks passed`);
if (failed.length) process.exitCode = 1;
