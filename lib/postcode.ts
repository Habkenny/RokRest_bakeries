/**
 * Sheffield delivery zone check. Ideal Postcodes can replace this
 * when IDEAL_POSTCODES_API_KEY is set (not wired in demo).
 */
const ALLOWED_PREFIXES = [
  /^S1\b/i,
  /^S2\b/i,
  /^S3\b/i,
  /^S4\b/i,
  /^S5\b/i,
  /^S6\b/i,
  /^S7\b/i,
  /^S8\b/i,
  /^S9\b/i,
  /^S10\b/i,
  /^S11\b/i,
  /^S35\b/i,
  /^S36\b/i,
];

export function isPostcodeAllowed(raw: string) {
  const normalized = raw.trim().toUpperCase().replace(/\s+/g, " ");
  return ALLOWED_PREFIXES.some((re) => re.test(normalized));
}
