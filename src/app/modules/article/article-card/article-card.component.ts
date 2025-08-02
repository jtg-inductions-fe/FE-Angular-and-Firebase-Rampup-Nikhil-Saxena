import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Article } from '@core/models/article.model';
import { ArticleService } from '@services/article.service';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private snackbar = inject(SnackbarService);
  private cdr = inject(ChangeDetectorRef);

  @Input() cardImage: string | null = '';
  @Input() mode: 'view' | 'preview' = 'view';
  @Input() cardTitle: string = '';
  @Input() username: string | undefined = '';
  @Input() cardContent: string = '';
  @Input() lastUpdateDate: string | null = '';
  @Input() tags: string[] = [];

  isViewMode = false;
  articleId!: string;

  ngOnInit(): void {
    this.isViewMode = this.mode === 'view';

    if (this.isViewMode) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (!id) {
          this.snackbar.show('Article ID is missing.');
          return;
        }

        this.articleId = id;
        this.fetchArticleById(id);
      });
    }
  }

  private fetchArticleById(id: string): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article: Article | null) => {
        if (!article) {
          this.snackbar.show('Article not found.');
          return;
        }

        this.cardImage = article.articleImage || '';
        this.cardTitle = article.articleTitle || '';
        this.username = article.articleUsername || '';
        this.cardContent = article.articleContent || '';
        this.lastUpdateDate = article.createdAt?.toString() || '';
        this.tags = article.articleTags || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackbar.show('Failed to load article.');
      },
    });
  }
}
