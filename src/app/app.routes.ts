import { Routes } from '@angular/router';

import { AccessGuard } from '@core/guards/access.guard';

export const ROUTE_REF: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/home/home.component').then(m => m.HomeComponent),
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
    path: 'admin',
    loadChildren: () =>
      import('@modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AccessGuard],
    data: { requiresAuth: true }, // Require login
  },
  {
    path: '**',
    loadComponent: () =>
      import('@pages/notFound/notFound.component').then(
        m => m.NotFoundComponent
      ),
  },
];
