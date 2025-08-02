import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';

import { Article as AppArticle } from '@core/models/article.model';
import { ArticleService } from '@services/article.service';
import type {
  GridReadyEvent,
  RowModelType,
  Theme,
  IDatasource,
  IGetRowsParams,
} from 'ag-grid-community';
import { themeAlpine } from 'ag-grid-community';

import { articleListColumnDefinition } from './article-list-column-definition';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ArticleListComponent {
  private articleService = inject(ArticleService);

  rowModelType: RowModelType = 'infinite';
  rowBuffer = 0;
  cacheBlockSize = 10;
  maxConcurrentDatasourceRequests = 1;
  infiniteInitialRowCount = 10;
  maxBlocksInCache = 10;
  pagination = true;
  paginationPageSize = 10;

  myTheme = themeAlpine.withParams({ spacing: 12 });
  theme: Theme | 'legacy' = this.myTheme;

  rowData!: AppArticle[];
  colDefs = articleListColumnDefinition;

  private lastVisibleDocMap = new Map<
    number,
    DocumentSnapshot<DocumentData, DocumentData> | undefined
  >();

  onGridReady(params: GridReadyEvent<AppArticle>) {
    const dataSource: IDatasource = {
      rowCount: undefined,
      getRows: (rowParams: IGetRowsParams) => {
        const sortArray: { colId: string; sort: 'asc' | 'desc' }[] =
          rowParams.sortModel.map(sort => ({
            colId: sort.colId,
            sort: sort.sort as 'asc' | 'desc',
          }));

        const page = rowParams.startRow / this.paginationPageSize;
        const lastVisibleDoc = this.lastVisibleDocMap.get(page - 1);

        this.articleService
          .getAllArticlesByUserIdWithLimit(
            this.paginationPageSize,
            sortArray,
            lastVisibleDoc
          )
          .subscribe({
            next: res => {
              const data = res.articles;
              const lastDoc = res.lastDoc;

              if (data) {
                if (lastDoc) {
                  this.lastVisibleDocMap.set(page, lastDoc);
                }
                const lastRow =
                  data.length < this.paginationPageSize
                    ? rowParams.startRow + data.length
                    : -1;
                rowParams.successCallback(data, lastRow);
              } else {
                rowParams.successCallback([], 0);
              }
            },
            error: () => {
              rowParams.failCallback();
            },
          });
      },
    };

    params.api!.setGridOption('datasource', dataSource);
  }
}
