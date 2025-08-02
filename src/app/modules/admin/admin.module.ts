import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ArticleListModule } from '@features/articles-list/article-list.module';
import { FiltersSidebarModule } from '@features/filters-sidebar/filters-sidebar.module';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ArticleListModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FiltersSidebarModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class AdminModule {}
