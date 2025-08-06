import {
  ChangeDetectionStrategy,
  Component,
  Input,
  model,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ArticleTagObjectModel } from '@core/models/article-tag.model';
import { blogTags } from '@shared/constants/blogTags';
import { TagInputModule } from 'ngx-chips';

/**
 * Component for displaying and managing tag input for articles.
 * This component uses the ngx-chips TagInputModule to allow users to add or view tags
 * related to their story. It supports both editable and view-only modes.
 */
@Component({
  selector: 'app-article-tag-input',
  standalone: true,
  imports: [TagInputModule, ReactiveFormsModule, FormsModule],
  templateUrl: './article-tag-input.component.html',
  styleUrl: './article-tag-input.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTagInputComponent implements OnInit {
  /**
   * Defines the mode of the tag input.
   * - `'edit'`: allows adding/removing tags.
   * - `'view'`: displays tags in a non-editable format.
   * @default 'edit'
   */
  @Input() mode: 'edit' | 'view' = 'edit';

  /**
   * Placeholder text shown in the tag input field.
   * @default 'Tags Related to your story'
   */
  @Input() placeholder: string = 'Tags Related to your story';

  /** Array of selected tag objects. */
  tags = model<ArticleTagObjectModel[]>([]);

  /** Whether the tag input is editable. */
  isEditable!: boolean;

  /** List of autocomplete suggestions for tags. */
  autocompleteItems = blogTags;

  /** Placeholder for the input field, conditionally set based on input mode. */
  inputPlaceholder!: string;

  /** ID for disabling input styles when in view-only mode. */
  inputDisabledId: 'article-tags-input--disabled' | '' = '';

  /**
   * Lifecycle hook that runs on component initialization.
   * It sets the editable state, placeholder, and disabled styles accordingly.
   */
  ngOnInit() {
    this.isEditable = this.mode === 'edit';
    if (!this.isEditable) this.inputDisabledId = 'article-tags-input--disabled';
    this.inputPlaceholder = this.placeholder;
  }
}
