/** Canonical AI state names handled by the global presentation-localization pipeline. */
export const AI_LOCALIZATION_KEYS = [
  "business",
  "pulseData",
  "diagnosis",
  "marketData",
  "autopilotData",
  "growthActions",
  "businessUpdates",
  "decisionResult",
];

export function createAiLocalizationTargets(states, setters) {
  return AI_LOCALIZATION_KEYS
    .map((key) => [key, states?.[key], setters?.[key]])
    .filter(([, value, setter]) => value !== null && value !== undefined && typeof setter === "function");
}
