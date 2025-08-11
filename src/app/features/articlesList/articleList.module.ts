import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArticleService } from '@services/article.service';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ModuleRegistry,
  InfiniteRowModelModule,
  PaginationModule,
} from 'ag-grid-community';

import { ArticleListComponent } from './articleList.component';

ModuleRegistry.registerModules([PaginationModule, InfiniteRowModelModule]);

@NgModule({
  declarations: [ArticleListComponent],
  imports: [CommonModule, AgGridAngular],
  exports: [ArticleListComponent],
  providers: [ArticleService],
})
export class ArticleListModule {}
