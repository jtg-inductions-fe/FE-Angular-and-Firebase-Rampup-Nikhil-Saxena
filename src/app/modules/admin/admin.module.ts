import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArticleListModule } from '@features/articles-list/article-list.module';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, AdminRoutingModule, ArticleListModule],
})
export class AdminModule {}
