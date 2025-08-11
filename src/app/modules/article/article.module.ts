import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ArticleTagInputComponent } from '@features/articleTagInput/articleTagInput.component';
import { EditorModule } from '@features/richEditor/richEditor.module';
import { ImageService } from '@services/image.service';
import { ArticleTagPipe } from '@shared/pipes/articleTagsPipe.pipe';
import { DateTransform } from '@shared/pipes/customDate.pipe';
import { TagInputModule } from 'ngx-chips';

import { ArticleCardComponent } from './articleCard/articleCard.component';
import { ArticleRoutingModule } from './articleRouting.module';
import { CreateArticleComponent } from './createUpdateArticle/createUpdateArticle.component';

@NgModule({
  declarations: [CreateArticleComponent, ArticleCardComponent, DateTransform],
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
    ArticleTagInputComponent,
  ],
  providers: [ImageService, ArticleTagPipe],
})
export class ArticleModule {}
