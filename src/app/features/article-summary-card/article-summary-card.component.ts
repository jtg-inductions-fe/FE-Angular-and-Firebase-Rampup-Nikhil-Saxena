import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Article } from '@core/models/article.model';
import { NavigationService } from '@services/navigation.services';
import { TagInputModule } from 'ngx-chips';

@Component({
  selector: 'app-article-summary-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    TagInputModule,
    FormsModule,
  ],
  templateUrl: './article-summary-card.component.html',
  styleUrl: './article-summary-card.component.scss',
})
export class ArticleSummaryCardComponent {
  private navigationService = inject(NavigationService);
  @Input() articleDetails: Article | null = null;

  /**
   * Navigates to the article view page
   */
  view(): void {
    this.navigationService.handleNavigation(
      `/article/view/${this.articleDetails?.articleId}`
    );
  }
}
