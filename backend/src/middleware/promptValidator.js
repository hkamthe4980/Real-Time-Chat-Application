// src/middleware/promptValidator.js

const SUSPICIOUS_PATTERNS = [
  /ignore (previous|all) instructions/i,
  /ignore system prompt/i,
  /\b(reveal|show|expose)\b.*\b(api|secret|key|password)\b/i,
  /system:.*change.*behavior/i,
  /(please|kindly)?\s*(disregard|ignore)\s*(the|this)\s*(system|instruction)s?/i,
];

export function validatePrompt(prompt, opts = {}) {
    console.log("Validate Prompt" , prompt)
  const maxLen = opts.maxLength || 100;
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return { error: true, reason: "Prompt required" };
  }
  if (prompt.length > maxLen) {
    return { error: true, reason: `Prompt exceeds ${maxLen} characters` };
  }
  for (const re of SUSPICIOUS_PATTERNS) {
    if (re.test(prompt)) {
      return { error: true, reason: "Prompt flagged as potentially malicious" };
    }
  }
  return null; // OK
}
