import { Routes } from '@angular/router';

import { accessGuard } from '@core/guards/access.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [accessGuard],
    data: { requiresAuth: true }, // Require login
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@modules/auth/auth.module').then(m => m.AuthenticationModule),
    canActivate: [accessGuard],
    data: { requiresAuth: false }, // Only guests
  },
  {
    path: '**',
    loadComponent: () =>
      import('@pages/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
];
