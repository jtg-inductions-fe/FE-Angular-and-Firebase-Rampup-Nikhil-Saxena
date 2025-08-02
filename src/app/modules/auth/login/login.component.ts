import { Component, inject, signal, computed } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';

import { AuthService } from '@services/auth.services';
import { NavigationService } from '@services/navigation.services';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  /** Injects AuthService for authentication logic */
  private authService = inject(AuthService);

  /** Injects NavigationService for route handling */
  private navigationService = inject(NavigationService);

  /** Injects SnackbarService to show messages */
  private snackBarService = inject(SnackbarService);

  /** Form group for login fields */
  loginForm = new FormGroup({
    /** Email form control with validation */
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    /** Password form control with validation */
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /** Signal to track submission state */
  isSubmitting = signal(false);

  /** Signal to toggle password visibility */
  hidePassword = signal(true);

  /** Signal to hold error message */
  errorMessage = signal('');

  /** Signal to hold success message */
  successMessage = signal('');

  /** Signal for email control */
  emailControl = signal(this.loginForm.get('email') as FormControl<string>);

  /** Signal for password control */
  passwordControl = signal(
    this.loginForm.get('password') as FormControl<string>
  );

  /** Computed signal for email errors */
  emailErrors = computed(() => this.emailControl().errors);

  /** Computed signal for password errors */
  passwordErrors = computed(() => this.passwordControl().errors);

  /**
   * Toggles password visibility
   * @param event Mouse click event
   */
  clickEvent(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  /** Handles login form submission */
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting.set(true);
    this.loginForm.disable();
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, password } = this.loginForm.getRawValue();

    this.authService.loginUser(email, password).subscribe({
      next: user => {
        const message = `Successfully Logged In ${user.email}`;
        this.successMessage.set(message);
        this.snackBarService.show(message);
        this.isSubmitting.set(false);
        this.navigationService.handleNavigation('/');
      },
      error: error => {
        this.handleFirebaseError(error);
        this.loginForm.enable();
        this.isSubmitting.set(false);
      },
    });
  }

  /**
   * Parses and handles Firebase login errors
   * @param error Error returned from Firebase
   */
  private handleFirebaseError(error: unknown) {
    this.emailControl().setErrors(null);
    this.passwordControl().setErrors(null);

    const errorStr = String(error);
    let message = 'Login failed. Please try again.';

    if (
      errorStr.includes('auth/user-not-found') ||
      errorStr.includes('auth/wrong-password') ||
      errorStr.includes('auth/invalid-credential')
    ) {
      message = 'Invalid email or password.';
    } else if (errorStr.includes('auth/too-many-requests')) {
      message = 'Too many failed attempts. Try again later.';
    } else if (errorStr.includes('User data not found in database')) {
      message = 'Account does not exist or was deleted.';
    }

    this.errorMessage.set(message);
    this.snackBarService.show(message);
  }
}
