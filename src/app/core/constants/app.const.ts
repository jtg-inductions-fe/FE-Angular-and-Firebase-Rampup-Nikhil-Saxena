/**
 * A regular expression that validates a strong password.
 * Requirements:
 * - At least 8 characters long, at least one letter, least one digit (0–9), at least one special character {@$!%*#?&}
 */
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
