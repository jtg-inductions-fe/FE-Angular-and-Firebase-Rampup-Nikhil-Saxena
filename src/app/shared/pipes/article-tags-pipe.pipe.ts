import { Pipe, PipeTransform } from '@angular/core';

import { ArticleTagObjectModel } from '@core/models/article-tag.model';

/**
 * Transforms an array of article tag objects into an array of tag display strings.
 *
 * Usage:
 *   tagArray | tagsDisplay
 */
@Pipe({
  name: 'tagsDisplay',
})
export class ArticleTagPipe implements PipeTransform {
  /**
   * Transforms a list of tag objects to a list of their display strings.
   *
   * @param value - Array of ArticleTagObjectModel objects.
   * @returns An array of strings representing the display value of each tag.
   */
  transform(value: ArticleTagObjectModel[]): string[] {
    if (!value) return [];
    return value.map(tag => tag.display);
  }
}
