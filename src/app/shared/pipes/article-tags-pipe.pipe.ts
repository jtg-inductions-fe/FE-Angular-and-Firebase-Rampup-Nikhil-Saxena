import { Pipe, PipeTransform } from '@angular/core';

import { ArticleTagObjectModel } from '@core/models/article-tag.model';

/**
 * A custom Angular pipe to format Article Tags into String.
 *
 * It returns an String of tags separated by ',' containing tags for a particular Article.
 */
@Pipe({
  name: 'articleTagPipe',
})
export class ArticleTagPipe implements PipeTransform {
  /**
   * @param value - A Tag object containing display and value option for each tag
   * @returns An array of string containing tags for a particular Article.
   */
  transform(value: ArticleTagObjectModel[]): string[] {
    if (!value) return [];
    const tagString = value.map((tags: ArticleTagObjectModel) => tags.display);

    return tagString;
  }
}
