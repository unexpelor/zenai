/**
 * Translation helpers. The API receives a complete AI payload; this module
 * only provides stable hashing used by the client cache.
 */
export function stableHash(value) {
  const input = typeof value === "string" ? value : JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
