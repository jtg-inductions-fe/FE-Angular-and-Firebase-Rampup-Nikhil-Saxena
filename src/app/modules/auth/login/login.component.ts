import { Component, inject, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@services/auth.services';
import { NavigationService } from '@services/navigation.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private navigate = inject(NavigationService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  hide = signal(true);
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
      next: userCredential => {
        this.successMessage = `Successfully Logged In ${userCredential.email}`;
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

  private handleFirebaseError(errorCode: string) {
    this.email?.setErrors(null);
    this.password?.setErrors(null);

    const errorStr = String(errorCode); // Typecast to string
    console.log(errorStr);

    if (
      errorStr.includes('auth/user-not-found') ||
      errorStr.includes('auth/invalid-credential')
    ) {
      this.errorMessage = 'Invalid email or password.';
    } else if (errorStr.includes('auth/too-many-requests')) {
      this.errorMessage = 'Too many failed attempts. Try again later.';
    } else {
      this.errorMessage = 'Login failed. Please try again.';
    }
  }
}
