import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { Article as AppArticle } from '@core/models/article.model';
import type { Theme } from 'ag-grid-community';
import { themeAlpine } from 'ag-grid-community';

import { articleListColumnDefinition } from './article-list-column-definition';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ArticleListComponent implements OnInit {
  @Input() articleListData: AppArticle[] | null = null;
  refinedArticleList = signal<Array<object>>([]);

  pagination = true;
  paginationPageSize = 10;

  myTheme = themeAlpine.withParams({ spacing: 13 });

  theme: Theme | 'legacy' = this.myTheme;

  rowData: AppArticle[] = [];
  colDefs = articleListColumnDefinition;

  ngOnInit() {
    this.articleListData = this.articleListData ?? [];
    this.rowData = this.articleListData;
  }
}
