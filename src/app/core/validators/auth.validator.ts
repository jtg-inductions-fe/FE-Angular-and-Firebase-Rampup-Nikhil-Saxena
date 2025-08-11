import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Matches password and confirm password fields.
 */
export function matchPasswordsValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };
}
