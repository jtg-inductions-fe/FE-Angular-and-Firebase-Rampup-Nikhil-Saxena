import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ArticleTagInputComponent } from '@features/article-tag-input/article-tag-input.component';
import { EditorModule } from '@features/rich-editor/rich-editor.module';
import { ImageService } from '@services/image.service';
import { ArticleTagPipe } from '@shared/pipes/article-tags-pipe.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';
import { TagInputModule } from 'ngx-chips';

import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticleRoutingModule } from './article.routing-module';
import { CreateArticleComponent } from './create-update-article/create-update-article.component';

@NgModule({
  declarations: [CreateArticleComponent, ArticleCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TagInputModule,
    ArticleRoutingModule,
    EditorModule,
    PipesModule,
    ArticleTagInputComponent,
  ],
  providers: [ImageService, ArticleTagPipe],
})
export class ArticleModule {}
