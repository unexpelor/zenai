/**
 * Translate a complete JSON-compatible payload in one request.
 * The translator is responsible for recursively handling human-readable
 * string values while preserving keys and data structure.
 */
export async function translateContent(value, translatePayload) {
  if (value === null || value === undefined) return value;
  if (typeof translatePayload !== "function") {
    throw new TypeError("translatePayload must be a function");
  }
  return translatePayload(value);
}

export function stableHash(value) {
  const input = typeof value === "string" ? value : JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
