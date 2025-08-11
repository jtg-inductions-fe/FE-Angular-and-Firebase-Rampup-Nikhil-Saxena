import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ArticleListModule } from '@features/articlesList/articleList.module';
import { FiltersSidebarModule } from '@features/filtersSidebar/filtersSidebar.module';
import { ArticleTagPipe } from '@shared/pipes/articleTagsPipe.pipe';

import { AdminRoutingModule } from './adminRouting.module';
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
  providers: [ArticleTagPipe],
})
export class AdminModule {}
