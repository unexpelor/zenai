import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const page = read("app/page.js");
const layout = read("app/layout.js");
const switcher = read("components/LanguageSwitcher.jsx");
const provider = read("providers/ZenLocaleProvider.jsx");
const localizationHook = read("hooks/useAILocalization.js");
const localizationCache = read("lib/localization/localizationCache.js");
const translateRoute = read("app/api/translate/route.js");
const sidebar = read("components/Sidebar.jsx");
const checks = [];
const check = (name, condition) => checks.push({ name, pass: Boolean(condition) });

check("No reload-based locale switching", !page.includes("window.location.reload") && !switcher.includes("window.location.reload") && !sidebar.includes("window.location.reload"));
check("Reactive locale provider", layout.includes("ZenLocaleProvider") && provider.includes("NextIntlClientProvider") && provider.includes("setLocaleState"));
check("Locale persisted in cookie", provider.includes("NEXT_LOCALE=") && provider.includes("Max-Age=31536000"));
check("Canonical AI source exists", page.includes("aiCanonicalRef") && page.includes("canonicalValueForSave"));
check("Latest locale wins", localizationHook.includes("generationRef") && localizationHook.includes("generation === generationRef.current") && page.includes("isCurrent(generation)"));
check("Abort stale translations", localizationHook.includes("new AbortController()") && localizationHook.includes("controllerRef.current?.abort()"));
check("Cache uses source hash + locale", localizationCache.includes("${sourceHash}_${locale}") && page.includes("sourceHash"));
check("New AI states are registered", page.includes('registerCanonicalAi("growthActions"') && page.includes("lastPresentationHash"));
check("Persisted AI source locale metadata", page.includes("aiSourceLocales") && page.includes("saved.aiSourceLocales"));
check("Yandex translation server", translateRoute.includes("YANDEX_TRANSLATE_API_KEY") && translateRoute.includes("translate.api.cloud.yandex.net") && translateRoute.includes("Authorization: `Api-Key"));
check("No legacy Google translation", !translateRoute.includes("GOOGLE_TRANSLATE") && !translateRoute.includes("translation.googleapis.com"));
check("Dashboard state normalization", page.includes("normalizePulse") && page.includes("normalizeDiagnosis") && page.includes("normalizeMarket") && page.includes("normalizeAutopilot"));
check("Corrupt tab cannot select invalid UI", page.includes("validTabs.has(saved.tab)"));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`RESULT: ${checks.length - failed.length}/${checks.length} localization regression checks passed`);
if (failed.length) process.exitCode = 1;
