import { Routes } from '@angular/router';

import { HomeComponent } from '@pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@modules/auth/auth.module').then(m => m.AuthenticationModule),
    canActivate: [guestGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('@pages/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
];
