import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Routes, RouterModule } from '@angular/router';

import { ArticleSummaryCardComponent } from '@features/article-summary-card/article-summary-card.component';

import { HomeComponent } from './home.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    ArticleSummaryCardComponent,
  ],
  exports: [RouterModule],
})
export class HomeModule {}
