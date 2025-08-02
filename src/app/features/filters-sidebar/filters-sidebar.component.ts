import { Component, model } from '@angular/core';

import { ArticleTagObjectModel } from '@core/models/article-tag.model';
import { ArticleTagPipe } from '@shared/pipes/article-tags-pipe.pipe';

@Component({
  selector: 'app-filters-sidebar',
  templateUrl: './filters-sidebar.component.html',
  styleUrls: ['./filters-sidebar.component.scss'],
})
export class FiltersSidebarComponent {
  private articleTagPipe = new ArticleTagPipe();

  tags: ArticleTagObjectModel[] = [];

  // Use separate objects for each date range
  lastUpdatedRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };
  createdAtRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };

  isSidebarOpen = model<boolean>(true);

  handleSidebarToggle(): void {
    this.isSidebarOpen.set(false);
  }

  handleApplyFilters(): void {}

  handleClearFilters(): void {
    this.tags = [];
    this.lastUpdatedRange = { start: null, end: null };
    this.createdAtRange = { start: null, end: null };
  }
}
