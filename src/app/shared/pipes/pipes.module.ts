import { NgModule } from '@angular/core';

import { ArticleTagPipe } from './article-tags-pipe.pipe';
import { DateTransformPipe } from './custom-date.pipe';

@NgModule({
  imports: [],
  declarations: [ArticleTagPipe, DateTransformPipe],
  exports: [ArticleTagPipe, DateTransformPipe],
})
export class PipesModule {}
