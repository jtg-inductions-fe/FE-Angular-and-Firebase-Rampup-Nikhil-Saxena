import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.services';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated: boolean = authService.getAuthenticationStatus();
  if (!isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
