import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

import { emailRegex } from '@core/constants/constants';
import { AuthService } from '@services/auth.services';
import { NavigationService } from '@services/navigation.services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private navigate = inject(NavigationService);
  private authService = inject(AuthService);

  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  signupForm: FormGroup = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(emailRegex),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.matchPasswordsValidator() }
  );

  get username() {
    return this.signupForm.get('username');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  matchPasswordsValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.isSubmitting = true;
    this.signupForm.disable();
    this.errorMessage = null;
    this.successMessage = null;

    const { email, password, username } = this.signupForm.getRawValue();

    this.authService.registerUser(email, password, username).subscribe({
      next: userCredential => {
        this.successMessage = `Successfully registered ${userCredential.user.email}`;
        this.isSubmitting = false;
        this.navigate.handleNavigation('/');
      },
      error: error => {
        this.handleFirebaseError(error);
        this.signupForm.enable();
        this.isSubmitting = false;
      },
    });
  }

  private handleFirebaseError(errorCode: string) {
    this.email?.setErrors(null);
    this.password?.setErrors(null);
    this.confirmPassword?.setErrors(null);

    const errorStr = String(errorCode); // Typecast to string

    if (
      errorStr.includes('already exists') ||
      errorStr.includes('email-already-in-use')
    ) {
      this.errorMessage = 'Email Already in use. Please try Log In';
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    }
  }
}
