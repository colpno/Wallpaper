type CalculatePasswordStrengthReturn = {
  score: number;
  label: "weak" | "medium" | "strong";
};

/**
 * Calculate password strength based on length, variety,common patterns and repeated.
 * @returns A number represents the strength of the password. Min: 0, Max: 100.
 */
export const calculatePasswordStrength = (password: string): CalculatePasswordStrengthReturn => {
  let score = 0;

  if (!password) {
    return { score: 0, label: "weak" };
  }

  const length = password.length;

  // Length score (max 30)
  score += Math.min(30, length * 2);

  // Character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  score += varietyCount * 10; // max 40

  // Bonus for mixing
  if (hasLower && hasUpper) score += 5;
  if (hasNumber && (hasLower || hasUpper)) score += 5;
  if (hasSymbol) score += 5;

  // Penalties
  if (length < 8) score -= 15;

  if (/^(.)\1+$/.test(password)) {
    // repeated chars like "aaaaaa"
    score -= 20;
  }

  if (/1234|abcd|qwerty|password/i.test(password)) {
    score -= 25;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  let label: CalculatePasswordStrengthReturn["label"] = "weak";
  if (score > 66) label = "strong";
  else if (score > 33) label = "medium";

  return { score, label };
};
