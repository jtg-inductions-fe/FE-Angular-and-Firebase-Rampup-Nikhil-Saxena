import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';

import { AuthService } from '@services/auth.services';

/**
 * Route guard to control access based on authentication status.
 *
 * It checks if the route requires authentication and whether the user is authenticated,
 * and redirects accordingly.
 *
 * - If `requiresAuth` is true and the user is not authenticated, redirects to `/auth/login`.
 * - If `requiresAuth` is false and the user *is* authenticated, redirects to the home page `/`.
 *
 * @param route The current route snapshot containing route metadata.
 * @returns `true` if access is allowed, `false` otherwise (after redirect).
 */
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
