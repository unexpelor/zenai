/**
 * Translate human-readable values while preserving object keys and structure.
 * The caller supplies translateChunk so API/auth concerns stay outside this utility.
 */
export async function translateContent(value, translateChunk) {
  if (value === null || value === undefined) return value;
  if (typeof translateChunk !== "function") throw new TypeError("translateChunk must be a function");

  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => translateContent(item, translateChunk)));
  }

  if (typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, item]) => [key, await translateContent(item, translateChunk)])
    );
    return Object.fromEntries(entries);
  }

  if (typeof value === "string") return translateChunk(value);
  return value;
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
