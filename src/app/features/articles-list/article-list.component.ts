import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';

import { ArticleFilters } from '@core/models/article-filters.model';
import { Article as AppArticle } from '@core/models/article.model';
import { ArticleService } from '@services/article.service';
import type {
  GridReadyEvent,
  RowModelType,
  Theme,
  IDatasource,
  IGetRowsParams,
  GridApi,
} from 'ag-grid-community';
import { themeAlpine } from 'ag-grid-community';

import { articleListColumnDefinition } from './article-list-column-definition';
import { ArticleFilterAndSearchService } from '../../services/article-filters-search.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ArticleListComponent {
  private articleService = inject(ArticleService);
  private articleFilterAndSearchService = inject(ArticleFilterAndSearchService);

  rowModelType: RowModelType = 'infinite';
  rowBuffer = 15;
  cacheBlockSize = 15;
  maxConcurrentDatasourceRequests = 1;
  infiniteInitialRowCount = 20;
  maxBlocksInCache = 15;
  pagination = true;
  paginationPageSize = 15;
  currentFilter!: ArticleFilters;
  currentSearchString!: string;
  isLoading: boolean = false;

  gridApi: GridApi | null = null;

  myTheme = themeAlpine.withParams({ spacing: 8 });
  theme: Theme | 'legacy' = this.myTheme;

  rowData!: AppArticle[];
  colDefs = articleListColumnDefinition;

  private lastVisibleDocMap = new Map<
    number,
    DocumentSnapshot<DocumentData, DocumentData> | undefined
  >();

  onGridReady(params: GridReadyEvent<AppArticle>) {
    this.gridApi = params.api;
    const dataSource: IDatasource = {
      rowCount: undefined,
      getRows: (rowParams: IGetRowsParams) => {
        this.isLoading = true;
        const sortArray: { colId: string; sort: 'asc' | 'desc' }[] =
          rowParams.sortModel.map(sort => ({
            colId: sort.colId,
            sort: sort.sort as 'asc' | 'desc',
          }));

        const page = rowParams.startRow / this.paginationPageSize;
        const lastVisibleDoc = this.lastVisibleDocMap.get(page - 1);

        this.articleService
          .getAllArticlesByUserIdWithOptions(
            this.paginationPageSize,
            sortArray,
            this.currentFilter,
            this.currentSearchString,
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
                this.gridApi?.showNoRowsOverlay();
                rowParams.successCallback([], 0);
              }
              this.isLoading = false;
            },
            error: () => {
              rowParams.failCallback();
            },
          });
      },
    };

    params.api!.setGridOption('datasource', dataSource);
  }

  constructor() {
    this.articleFilterAndSearchService.currentSharedFilter.subscribe(value => {
      this.currentFilter = value;
      this.gridApi?.purgeInfiniteCache();
    });

    this.articleFilterAndSearchService.currentSharedSearchString.subscribe(
      value => {
        this.currentSearchString = value;
        this.gridApi?.purgeInfiniteCache();
      }
    );
  }
}
