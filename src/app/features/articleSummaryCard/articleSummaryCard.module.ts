import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

import { Article } from '@core/models/article.model';
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
  templateUrl: './articleSummaryCard.component.html',
  styleUrl: './articleSummaryCard.component.scss',
})
export class ArticleSummaryCardComponent {
  private router = inject(Router);
  @Input() articleDetails: Article | null = null;

  /**
   * Navigates to the article view page
   */
  view(): void {
    this.router.navigate([`/article/view/${this.articleDetails?.articleId}`]);
  }
}
