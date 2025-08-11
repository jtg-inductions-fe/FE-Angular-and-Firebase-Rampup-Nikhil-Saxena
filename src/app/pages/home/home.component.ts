import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';

import { Article } from '@core/models/article.model';
import { ArticleSummaryCardComponent } from '@features/articleSummaryCard/articleSummaryCard.module';
import { ArticleService } from '@services/article.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ArticleSummaryCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private articleService = inject(ArticleService);

  /**
   * Stores the list of articles fetched from Firestore.
   */
  articleList!: Article[] | null;

  /**
   * Tracks the current index for pagination.
   */
  lastDocIndex: number = 0;

  /**
   * Maps page index to the last visible Firestore document snapshot
   * for use in pagination queries.
   */
  private lastVisibleDocMap = new Map<
    number,
    DocumentSnapshot<DocumentData, DocumentData> | undefined
  >();

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches the first batch of articles and stores pagination info.
   */
  ngOnInit(): void {
    this.articleService
      .getAllArticle(this.lastVisibleDocMap.get(this.lastDocIndex))
      .subscribe({
        next: data => {
          const articles = data.articles;
          const lastDoc = data.lastDoc;
          if (articles && articles.length > 0) {
            this.articleList = articles;
            if (lastDoc) {
              this.lastVisibleDocMap.set(this.lastDocIndex, lastDoc);
              this.lastDocIndex++;
            }
          }
        },
        error: () => {
          // TODO: handle error (e.g., show a snackbar or log)
        },
      });
  }
}
