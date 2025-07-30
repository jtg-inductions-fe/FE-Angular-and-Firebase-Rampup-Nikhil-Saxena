import { NgModule } from '@angular/core';

import { ArticleTagPipe } from './article-tags-pipe.pipe';
import { DateTransformPipe } from './custom-date.pipe';
import { DateTimestampPipe } from './dateTimestamp.pipe';

@NgModule({
  imports: [],
  declarations: [ArticleTagPipe, DateTransformPipe, DateTimestampPipe],
  exports: [ArticleTagPipe, DateTransformPipe, DateTimestampPipe],
})
export class PipesModule {}
