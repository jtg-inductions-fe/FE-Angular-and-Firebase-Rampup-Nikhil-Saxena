import { Component, inject, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';

import { AuthService } from '@services/auth.services';
import { NavigationService } from '@services/navigation.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private navigate = inject(NavigationService);

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

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  hide = signal<boolean>(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
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

    this.isSubmitting = true;
    this.loginForm.disable();
    this.errorMessage = null;
    this.successMessage = null;

    const { email, password } = this.loginForm.getRawValue();

    this.authService.loginUser(email, password).subscribe({
      next: user => {
        this.successMessage = `Successfully Logged In ${user.email}`;
        this.isSubmitting = false;
        this.navigate.handleNavigation('/');
      },
      error: error => {
        this.handleFirebaseError(error);
        this.loginForm.enable();
        this.isSubmitting = false;
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
  }
}
