import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';

import { AuthService } from '@services/auth.services';

/**
 * Route guard to control access based on authentication status.
 *
 * It checks if the route requires authentication and whether the user is authenticated,
 * and redirects accordingly.
 *
 * - If `REQUIRES_AUTH` is true and the user is not authenticated, redirects to `/auth/login`.
 * - If `REQUIRES_AUTH` is false and the user is authenticated, redirects to the home page `/`.
 *
 * @param route The current route snapshot containing route metadata.
 * @returns `true` if access is allowed, `false` otherwise (after redirect).
 */
export const AccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const REQUIRES_AUTH = route.data['requiresAuth'] === true;
  const IS_AUTHENTICATED = authService.getCurrentAuthenticationStatus();

  if (REQUIRES_AUTH && !IS_AUTHENTICATED) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (!REQUIRES_AUTH && IS_AUTHENTICATED) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
