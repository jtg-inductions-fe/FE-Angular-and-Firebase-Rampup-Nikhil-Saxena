import { Component, inject, model } from '@angular/core';

import { ArticleTagObjectModel } from '@core/models/articleTag.model';
import { ArticleFilterAndSearchService } from '@services/articleFiltersAndSearch.service';
import { ArticleTagPipe } from '@shared/pipes/articleTagsPipe.pipe';

@Component({
  selector: 'app-filters-sidebar',
  templateUrl: './filtersSidebar.component.html',
  styleUrls: ['./filtersSidebar.component.scss'],
})
export class FiltersSidebarComponent {
  private articleTagPipe = inject(ArticleTagPipe);
  private articleFilterService = inject(ArticleFilterAndSearchService);

  tags: ArticleTagObjectModel[] = [];

  lastUpdatedRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };
  createdAtRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };

  isSidebarOpen = model<boolean>(false);

  handleSidebarToggle(): void {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  handleApplyFilters(): void {
    this.articleFilterService.updateFilters({
      tags: this.articleTagPipe.transform(this.tags),
      lastUpdatedRange: this.lastUpdatedRange,
      createdAtRange: this.createdAtRange,
    });
    this.handleSidebarToggle();
  }

  handleClearFilters(): void {
    this.tags = [];
    this.lastUpdatedRange = { start: null, end: null };
    this.createdAtRange = { start: null, end: null };
    this.articleFilterService.updateFilters({
      tags: this.articleTagPipe.transform(this.tags),
      lastUpdatedRange: this.lastUpdatedRange,
      createdAtRange: this.createdAtRange,
    });
  }
}
