import { Component, inject, OnInit } from '@angular/core';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';

import { Article } from '@core/models/article.model';
import { ArticleService } from '@services/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private articleService = inject(ArticleService);
  articleList!: Article[] | null;
  lastDocIndex: number = 0;

  private lastVisibleDocMap = new Map<
    number,
    DocumentSnapshot<DocumentData, DocumentData> | undefined
  >();

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
        error: () => {},
      });
  }
}
