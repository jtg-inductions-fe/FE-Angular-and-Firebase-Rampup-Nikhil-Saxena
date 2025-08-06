import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { PASSWORD_REGEX } from '@core/constants/constants';
import { AuthService } from '@services/auth.services';
import { NavigationService } from '@services/navigation.services';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SignupComponent {
  // Injected Services
  private readonly navigationService = inject(NavigationService); // Handles route navigation
  private readonly snackBarService = inject(SnackbarService); // Shows snackbars
  private readonly authService = inject(AuthService); // Handles auth API calls

  // Reactive Signals
  isSubmitting = signal(false); // Tracks form submission state
  hidePassword = signal(true); // Toggles password visibility
  errorMessage = signal(''); // Holds error message
  successMessage = signal(''); // Holds success message

  // Reactive Form
  signupForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required]), // Username input
      email: new FormControl('', [Validators.required, Validators.email]), // Email input
      password: new FormControl('', [
        // Password input
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_REGEX),
      ]),
      confirmPassword: new FormControl('', [Validators.required]), // Confirm Password input
    },
    { validators: this.matchPasswordsValidator() } // Group-level validator
  );

  usernameControl = signal(this.signupForm.get('username') as FormControl); // Username control signal
  emailControl = signal(this.signupForm.get('email') as FormControl); // Email control signal
  passwordControl = signal(this.signupForm.get('password') as FormControl); // Password control signal
  confirmPasswordControl = signal(
    // Confirm password control signal
    this.signupForm.get('confirmPassword') as FormControl
  );

  /**
   * Toggles password visibility
   * @param event Mouse click event
   */
  clickEvent(event: MouseEvent): void {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  /**
   * Custom validator to match password and confirm password
   * @returns ValidatorFn
   */
  matchPasswordsValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  /**
   * Handles signup form submission
   */
  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.isSubmitting.set(true);
    this.signupForm.disable();
    this.errorMessage.set('');
    this.successMessage.set('');

    const formValues = this.signupForm.getRawValue();
    if (!formValues.email || !formValues.password || !formValues.username) {
      this.isSubmitting.set(false);
      this.signupForm.enable();
      return;
    }

    const { email, password, username } = formValues;

    this.authService.registerUser(email, password, username).subscribe({
      next: userCredential => {
        const message = `Successfully registered ${userCredential.user.email}`;
        this.successMessage.set(message);
        this.snackBarService.show(message);
        this.isSubmitting.set(false);
        this.navigationService.handleNavigation('/');
      },
      error: error => {
        this.handleFirebaseError(error);
        this.signupForm.enable();
        this.isSubmitting.set(false);
      },
    });
  }

  /**
   * Handles Firebase signup errors
   * @param error Firebase error object
   */
  private handleFirebaseError(error: unknown): void {
    this.emailControl().setErrors(null);
    this.passwordControl().setErrors(null);
    this.confirmPasswordControl().setErrors(null);

    const errorStr = String(error);
    let message = 'An unexpected error occurred. Please try again.';

    if (
      errorStr.includes('already exists') ||
      errorStr.includes('email-already-in-use')
    ) {
      message = 'Email already in use. Please try logging in.';
    } else if (errorStr.includes('weak-password')) {
      message =
        'Password must be at least 8 characters and contain letters, numbers, and special characters.';
    }

    this.errorMessage.set(message);
    this.snackBarService.show(message);
  }
}
