import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { Article as AppArticle } from '@core/models/article.model';
import { ArticleService } from '@services/article.service';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private articleService = inject(ArticleService);
  private localStorageService = inject(LocalStorageService);

  articleData = signal<AppArticle[] | null>(null);
  userId: string | undefined = '';

  ngOnInit() {
    this.userId = this.localStorageService.getLocalStorage()?.userId;
    if (!this.userId) return;
    this.articleService.getAllArticlesByUserId(this.userId).subscribe({
      next: data => {
        this.articleData.set(data);
      },
    });
  }
}
