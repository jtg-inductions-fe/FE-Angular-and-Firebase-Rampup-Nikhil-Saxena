import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';

import { AuthService } from '@services/auth.services';

export const accessGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiresAuth = route.data['requiresAuth'] === true;
  const isAuthenticated = authService.getAuthenticationStatus();

  if (requiresAuth && !isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (!requiresAuth && isAuthenticated) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
