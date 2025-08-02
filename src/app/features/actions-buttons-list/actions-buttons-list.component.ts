import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ArticleService } from '@services/article.service';
import { NavigationService } from '@services/navigation.services';
import { SnackbarService } from '@services/snackbar.service';
import { DialogBoxComponent } from '@shared/components/dialog-box/dialog-box.component';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-actions-buttons-list',
  standalone: true,
  imports: [MatIconModule, SharedComponentsModule, DialogBoxComponent],
  templateUrl: './actions-buttons-list.component.html',
  styleUrl: './actions-buttons-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionsButtonsListComponent
  implements ICellRendererAngularComp, OnDestroy
{
  private navigationService = inject(NavigationService);
  private articleService = inject(ArticleService);
  private dialog = inject(MatDialog);
  private snackBarService = inject(SnackbarService);

  /** Used for unsubscribing from observables */
  private destroy$ = new Subject<void>();

  /** AG Grid cell params */
  params!: ICellRendererParams;

  /** Article ID to act on */
  articleId: string = '';

  /**
   * AG Grid initialization lifecycle hook
   * @param params ICellRendererParams from AG Grid
   */
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.articleId = params?.data?.articleId || '';
  }

  /**
   * AG Grid method to determine if cell should be refreshed
   * @returns true (always refresh)
   */
  refresh(): boolean {
    return true;
  }

  /**
   * Navigates to the article view page
   */
  view(): void {
    this.navigationService.handleNavigation(`/article/view/${this.articleId}`);
  }

  /**
   * Navigates to the article edit page
   */
  edit(): void {
    this.navigationService.handleNavigation(`/article/edit/${this.articleId}`);
  }

  /**
   * Deletes the article after confirmation dialog
   */
  delete(): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        title: 'Confirm',
        message: 'Are you sure, You want to delete?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.articleService
            .deleteArticleById(this.articleId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.params.api.refreshInfiniteCache();
              },
              error: () => {
                this.snackBarService.show('Failed to Delete Article');
              },
            });
        }
      });
  }

  /**
   * Clean up all observable subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
