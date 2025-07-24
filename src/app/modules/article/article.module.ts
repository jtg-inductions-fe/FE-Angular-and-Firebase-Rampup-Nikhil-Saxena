import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { EditorModule } from '@features/rich-editor/text-editor.module';
import { ImageService } from '@services/image.service';
import { TagInputModule } from 'ngx-chips';
import { QuillModule } from 'ngx-quill';

import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticleRoutingModule } from './article.routing-module';
import { CreateArticleComponent } from './create-update-article/create-update-article.component';

@NgModule({
  declarations: [CreateArticleComponent, ArticleCardComponent],
  imports: [
    CommonModule,
    QuillModule.forRoot(),
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TagInputModule,
    ArticleRoutingModule,
    MatCardModule,
    EditorModule,
  ],
  providers: [ImageService],
})
export class ArticleModule {}
