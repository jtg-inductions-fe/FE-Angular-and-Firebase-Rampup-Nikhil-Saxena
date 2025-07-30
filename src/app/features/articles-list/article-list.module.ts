import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ActionsButtonsListComponent } from '@features/actions-buttons-list/actions-buttons-list.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

import { ArticleListComponent } from './article-list.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [ArticleListComponent],
  imports: [CommonModule, AgGridAngular, ActionsButtonsListComponent],
  exports: [ArticleListComponent],
  providers: [],
})
export class ArticleListModule {}
