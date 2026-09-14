/**
 * Translate one complete AI payload in a single request.
 * The translator is responsible for walking nested objects/arrays while this
 * utility guarantees we never fan out into one request per string.
 */
export async function translateContent(value, translatePayload) {
  if (value === null || value === undefined) return value;
  if (typeof translatePayload !== "function") throw new TypeError("translatePayload must be a function");
  if (typeof value !== "object") return value;
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
