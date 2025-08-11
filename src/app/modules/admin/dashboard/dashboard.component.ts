import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { ArticleFilterAndSearchService } from '@services/articleFiltersAndSearch.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  private articleSearchAndFilterService = inject(ArticleFilterAndSearchService);

  isSideBarOpen = false;

  onSearchChange($event: Event) {
    const searchString = ($event.target as HTMLInputElement).value;
    this.articleSearchAndFilterService.updateSearchString(searchString);
  }

  handleToggleSidebar(): void {
    this.isSideBarOpen = !this.isSideBarOpen;
  }
}
