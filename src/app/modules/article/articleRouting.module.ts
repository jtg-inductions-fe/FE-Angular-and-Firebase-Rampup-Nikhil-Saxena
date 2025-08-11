import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleCardComponent } from './articleCard/articleCard.component';
import { CreateArticleComponent } from './createUpdateArticle/createUpdateArticle.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'create', component: CreateArticleComponent },
  { path: 'edit/:id', component: CreateArticleComponent },
  { path: 'view/:id', component: ArticleCardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleRoutingModule {}
