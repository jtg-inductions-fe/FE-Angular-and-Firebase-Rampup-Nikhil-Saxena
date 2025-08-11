import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { DELETE_FAIL } from '@core/constants/messages.const';
import { ArticleService } from '@services/article.service';
import { SnackbarService } from '@services/snackbar.service';
import { DialogBoxComponent } from '@shared/components/dialogBox/dialogBox.component';
import { SharedComponentsModule } from '@shared/components/sharedComponents.module';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-actions-buttons-list',
  standalone: true,
  imports: [MatIconModule, SharedComponentsModule],
  templateUrl: './actionsButtonsList.component.html',
  styleUrl: './actionsButtonsList.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionsButtonsListComponent
  implements ICellRendererAngularComp, OnDestroy
{
  private routerService = inject(Router);
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
    this.routerService.navigate([`/article/view/${this.articleId}`]);
  }

  /**
   * Navigates to the article edit page
   */
  edit(): void {
    this.routerService.navigate([`/article/edit/${this.articleId}`]);
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
                this.snackBarService.show(DELETE_FAIL);
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
