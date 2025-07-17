import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('@pages/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@modules/auth/auth.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('@pages/search-page/search-page.component').then(
        m => m.SearchPageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('@modules/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
];
