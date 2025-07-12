import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { NotFoundComponent } from '@modules/not-found/not-found.component';
import { LoginComponent } from '@pages/auth/login/login.component';
import { SignupComponent } from '@pages/auth/signup/signup.component';
import { SearchPageComponent } from '@pages/search-page/search-page.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'search', component: SearchPageComponent },
  { path: '**', component: NotFoundComponent },
];
