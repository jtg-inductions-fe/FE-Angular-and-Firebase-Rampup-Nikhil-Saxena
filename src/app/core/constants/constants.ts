/**
 * A regular expression that validates a strong password.
 *
 * Requirements:
 * - At least 8 characters long
 * - Must contain at least one letter (uppercase or lowercase)
 * - Must contain at least one digit (0–9)
 * - Must contain at least one special character: @$!%*#?&
 *
 * Examples of valid passwords:
 * - "abc123$%"
 * - "Passw0rd!"
 * - "hello@2023"
 */
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
