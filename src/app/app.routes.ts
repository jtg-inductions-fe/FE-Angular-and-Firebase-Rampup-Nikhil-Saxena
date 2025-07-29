import { Routes } from '@angular/router';

import { AccessGuard } from '@core/guards/access.guard';

export const ROUTE_REF: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@pages/home/home.module').then(m => m.HomeModule),
    canActivate: [AccessGuard],
    data: { requiresAuth: true }, // Require login
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [AccessGuard],
    data: { requiresAuth: false }, // Only guests
  },
  {
    path: 'article',
    loadChildren: () =>
      import('@modules/article/article.module').then(m => m.ArticleModule),
    canActivate: [AccessGuard],
    data: { requiresAuth: true }, // Require login
  },
  {
    path: '**',
    loadComponent: () =>
      import('@pages/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
];
