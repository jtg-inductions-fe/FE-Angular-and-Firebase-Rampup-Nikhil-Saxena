import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { NavigationService } from '@services/navigation.services';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-actions-buttons-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './actions-buttons-list.component.html',
  styleUrl: './actions-buttons-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionsButtonsListComponent implements ICellRendererAngularComp {
  private navigationService = inject(NavigationService);
  //eslint-disable-next-line
  params: any;
  articleId: string = '';

  //eslint-disable-next-line
  agInit(params: any): void {
    this.params = params;
    this.articleId = params.data.articleId;
  }

  refresh(): boolean {
    return false;
  }

  view() {
    this.navigationService.handleNavigation(`/article/view/${this.articleId}`);
  }

  edit() {
    this.navigationService.handleNavigation(`/article/edit/${this.articleId}`);
  }

  delete() {
    console.log('Deleted');
    // TODO
  }
}
