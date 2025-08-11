import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PASSWORD_REGEX } from '@core/constants/app.const';
import {
  PASSWORD_VALIDATION_ERROR,
  UNEXPECTED_ERROR,
  USER_ALREADY_EXISTS,
} from '@core/constants/messages.const';
import { matchPasswordsValidator } from '@core/validators/auth.validator';
import { AuthService } from '@services/auth.services';
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
  private readonly routerService = inject(Router); // Handles route navigation
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
    { validators: matchPasswordsValidator() } // Group-level validator
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
        this.routerService.navigate(['/']);
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
    let message = UNEXPECTED_ERROR;

    if (
      errorStr.includes('already exists') ||
      errorStr.includes('email-already-in-use')
    ) {
      message = USER_ALREADY_EXISTS;
    } else if (errorStr.includes('weak-password')) {
      message = PASSWORD_VALIDATION_ERROR;
    }

    this.errorMessage.set(message);
    this.snackBarService.show(message);
  }
}
