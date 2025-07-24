import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleCardComponent } from './article-card/article-card.component';
import { CreateArticleComponent } from './create-update-article/create-update-article.component';

const routes: Routes = [
  { path: 'create', component: CreateArticleComponent },
  { path: 'edit/:id', component: CreateArticleComponent },
  { path: 'view', component: ArticleCardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleRoutingModule {}
