import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ArticleService } from '@services/article.service';
import { NavigationService } from '@services/navigation.services';
import { DialogBoxComponent } from '@shared/components/dialog-box/dialog-box.component';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

/**
 * Component for rendering action buttons (View, Edit, Delete)
 * inside an ag-Grid cell for each article row.
 */
@Component({
  selector: 'app-actions-buttons-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    SharedComponentsModule,
    DialogBoxComponent,
  ],
  templateUrl: './actions-buttons-list.component.html',
  styleUrl: './actions-buttons-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionsButtonsListComponent implements ICellRendererAngularComp {
  /** Injected services */
  private navigationService = inject(NavigationService);
  private articleService = inject(ArticleService);
  private dialog = inject(MatDialog);

  /** ag-Grid cell parameters */
  params!: ICellRendererParams;

  /** Current article ID from grid row data */
  articleId: string = '';

  /**
   * Called by ag-Grid to initialize the cell.
   * @param params - Cell parameters containing row data.
   */
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.articleId = params?.data?.articleId || '';
  }

  /**
   * ag-Grid calls this to check if the cell needs to be refreshed.
   * @returns true to allow refresh.
   */
  refresh(): boolean {
    return true;
  }

  /** Navigates to the article view page. */
  view() {
    this.navigationService.handleNavigation(`/article/view/${this.articleId}`);
  }

  /** Navigates to the article edit page. */
  edit() {
    this.navigationService.handleNavigation(`/article/edit/${this.articleId}`);
  }

  /**
   * Opens a confirmation dialog and deletes the article if confirmed.
   * Refreshes the ag-Grid infinite cache on success.
   */
  delete() {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        title: 'Confirm',
        message: 'Are you sure, You want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articleService.deleteArticleById(this.articleId).subscribe({
          next: () => {
            this.params.api.refreshInfiniteCache();
          },
        });
      }
    });
  }
}
