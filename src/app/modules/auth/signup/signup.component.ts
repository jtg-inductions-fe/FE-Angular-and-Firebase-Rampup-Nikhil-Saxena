import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.services';
import { NavigationService } from '@services/navigation.services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private navigate = inject(NavigationService);

  signupForm: FormGroup = this.fb.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const { email, password, username } = this.signupForm.value;

    this.authService.registerUser(email, password, username).subscribe({
      next: userCredential => {
        this.successMessage = `Successfully registered ${userCredential.user.email}`;
        this.isSubmitting = false;
        this.navigate.handleNavigation('/');
      },
      error: error => {
        if (
          error.code === 'auth/email-already-in-use' ||
          error.message?.includes('already exists')
        ) {
          this.errorMessage = 'Email already exists. Please try logging in.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
        this.isSubmitting = false;
      },
    });
  }
}
