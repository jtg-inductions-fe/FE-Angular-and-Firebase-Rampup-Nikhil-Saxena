import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ArticleTagObjectModel } from '@core/models/article-tag.model';
import { Article } from '@core/models/article.model';
import { ArticleService } from '@services/article.service';
import { ImageService } from '@services/image.service';
import { LocalStorageService } from '@services/local-storage.service';
import { NavigationService } from '@services/navigation.services';
import { SnackbarService } from '@services/snackbar.service';
import { blogTags } from '@shared/constants/blogTags';
import { ArticleTagPipe } from '@shared/pipes/article-tags-pipe.pipe';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-update-article.component.html',
  styleUrls: ['./create-update-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CreateArticleComponent implements OnInit {
  private imageService = inject(ImageService);
  private localStorage = inject(LocalStorageService);
  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);
  private snackBarService = inject(SnackbarService);

  articleTagPipe = new ArticleTagPipe();

  articleForm!: FormGroup;

  autocompleteItems = blogTags;
  editorValue = '';
  selectedFileName = '';
  base64Image: string | null = null;

  username = '';
  userId = '';
  title = '';
  tags: string[] = [];
  lastUpdatedDate: Timestamp | Date = new Date();
  createdAtDate: Timestamp | Date = new Date();

  articleId: string | null = null;
  isEditMode = false;

  resetForm(): void {
    this.articleForm.reset();
    this.editorValue = '';
    this.tags = [];
    this.base64Image = '';
    this.selectedFileName = '';
  }

  ngOnInit(): void {
    this.articleForm = new FormGroup({
      title: new FormControl('', Validators.required),
      titleImage: new FormControl(''),
      editorContent: new FormControl('', Validators.required),
      tags: new FormControl([], this.tagsValidator),
    });

    const user = this.localStorage.getLocalStorage();
    this.username = user?.username || '';
    this.userId = user?.userId || '';

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.articleId = id;
        this.isEditMode = true;
        this.fetchArticleById(id);
      }
    });

    this.articleForm
      .get('tags')
      ?.valueChanges.subscribe((newTags: ArticleTagObjectModel[]) => {
        this.tags = this.articleTagPipe.transform(newTags);
      });
  }

  private tagsValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return Array.isArray(value) && value.length > 0 ? null : { required: true };
  }

  private fetchArticleById(id: string): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article: Article | null) => {
        if (!article) {
          this.snackBarService.show('Article not found.');
          this.navigationService.handleNavigation('/');
          return;
        }

        if (article.userId !== this.userId) {
          this.snackBarService.show('Unauthorized access to article.');
          this.navigationService.handleNavigation('/');
          return;
        }

        this.articleForm.patchValue({
          title: article.articleTitle,
          titleImage: article.articleImage,
          tags: article.articleTags,
          editorContent: article.articleContent,
        });

        this.editorValue = article.articleContent;
        this.tags = article.articleTags;
        this.base64Image = article.articleImage;
        this.createdAtDate = article.createdAt;
      },
      error: () => {
        this.snackBarService.show('Error fetching article.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFileName = inputElement.files[0].name;

      this.imageService.encodeImage(inputElement).subscribe({
        next: result => {
          this.base64Image = result;
          this.articleForm.patchValue({ titleImage: result });
          this.snackBarService.show('Image uploaded successfully.');
        },
        error: () => {
          this.snackBarService.show('Image upload failed.');
        },
      });
    }
  }

  handleContentChange(newContent: string): void {
    this.editorValue = newContent;
    this.articleForm.patchValue({ editorContent: newContent });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      this.snackBarService.show('Please fill out all required fields.');
      return;
    }

    const formValue = this.articleForm.value;

    if (this.isEditMode && this.articleId) {
      const updatedFields = {
        articleTitle: formValue.title,
        articleImage: formValue.titleImage || '',
        articleContent: formValue.editorContent,
        articleTags: formValue.tags,
      };

      this.articleService
        .updateArticle(this.articleId, updatedFields)
        .subscribe({
          next: () => {
            this.snackBarService.show('Article updated successfully.');
            this.resetForm();
            this.navigationService.handleNavigation('/');
          },
          error: () => {
            this.snackBarService.show('Failed to update article.');
          },
        });
    } else {
      const newArticle = new Article(
        this.userId,
        Date.now().toString(),
        this.username,
        formValue.title,
        formValue.titleImage || '',
        formValue.editorContent,
        this.articleTagPipe.transform(formValue.tags),
        new Date(),
        new Date()
      );

      this.articleService.createArticle(newArticle).subscribe({
        next: () => {
          this.snackBarService.show('Article created successfully.');
          this.resetForm();
          this.navigationService.handleNavigation('/');
        },
        error: () => {
          this.snackBarService.show('Failed to create article.');
        },
      });
    }
  }
}
