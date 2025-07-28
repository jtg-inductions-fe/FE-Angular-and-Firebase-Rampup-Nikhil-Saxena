import { Component, inject, signal } from '@angular/core';
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
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private snackBarService = inject(SnackbarService);

  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting = signal(false);

  hidePassword = signal<boolean>(true);
  clickEvent(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting.set(true);
    this.loginForm.disable();
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password } = this.loginForm.getRawValue();

    this.authService.loginUser(email, password).subscribe({
      next: user => {
        this.successMessage = `Successfully Logged In ${user.email}`;
        this.snackBarService.show(this.successMessage);
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

  private handleFirebaseError(error: unknown) {
    this.email?.setErrors(null);
    this.password?.setErrors(null);

    const errorStr = String(error);

    if (
      errorStr.includes('auth/user-not-found') ||
      errorStr.includes('auth/wrong-password') ||
      errorStr.includes('auth/invalid-credential')
    ) {
      this.errorMessage = 'Invalid email or password.';
    } else if (errorStr.includes('auth/too-many-requests')) {
      this.errorMessage = 'Too many failed attempts. Try again later.';
    } else if (errorStr.includes('User data not found in database')) {
      this.errorMessage = 'Account does not exist or was deleted.';
    } else {
      this.errorMessage = 'Login failed. Please try again.';
    }

    this.snackBarService.show(this.errorMessage);
  }
}
