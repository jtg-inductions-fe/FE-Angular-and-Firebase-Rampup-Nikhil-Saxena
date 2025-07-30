import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCardComponent {
  @Input() cardImage: string | null = '';
  @Input() cardTitle: string = '';
  @Input() username: string | undefined = '';
  @Input() cardContent: string = '';
  @Input() lastUpdateDate: string | null = '';
  @Input() tags: string[] = [];
}
