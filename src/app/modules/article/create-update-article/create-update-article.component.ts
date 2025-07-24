import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { Article } from '@core/models/article.model';
import { ArticleService } from '@services/article.service';
import { ImageService } from '@services/image.service';
import { LocalStorageService } from '@services/local-storage.service';
import { NavigationService } from '@services/navigation.services';
import { blogTags } from '@shared/constants/blogTags';
import { CustomDatePipe } from '@shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-update-article.component.html',
  styleUrls: ['./create-update-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private imageService = inject(ImageService);
  private localStorage = inject(LocalStorageService);
  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);
  private snackBar = inject(MatSnackBar);

  articleForm!: FormGroup;

  autocompleteItems = blogTags;
  editorValue = '';
  selectedFileName = '';
  base64Image: string | null = null;

  username: string = '';
  userId: string = '';
  tags: string[] = [];
  lastUpdatedDate: string = '';
  createdAtDate: string = '';

  articleId: string | null = null;
  isEditMode = false;

  resetForm() {
    this.articleForm.reset();
    this.editorValue = '';
    this.tags = [];
    this.base64Image = '';
    this.selectedFileName = '';
  }

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      titleImage: [''],
      editorContent: ['', Validators.required],
      tags: [[], this.tagsValidator],
    });

    const user = this.localStorage.getLocalStorage();
    this.username = user?.username || '';
    this.userId = user?.userId || '';

    const now = new Date();
    const pipe = new CustomDatePipe();
    this.lastUpdatedDate = pipe.transform(now) || '';
    this.createdAtDate = pipe.transform(now) || '';

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.articleId = id;
        this.isEditMode = true;
        this.fetchArticleById(id);
      }
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
          this.snackBar.open('Article not found.', 'Close');
          this.navigationService.handleNavigation('/');
          return;
        }

        if (article.userId !== this.userId) {
          this.snackBar.open('Unauthorized access to article.', 'Close');
          this.navigationService.handleNavigation('/');
          return;
        }

        this.articleForm.patchValue({
          title: article.articleTitle,
          titleImage: article.articleImage,
          tags: article.articleTags,
        });

        this.editorValue = article.articleContent;
        this.tags = article.articleTags;
        this.base64Image = article.articleImage;
        this.createdAtDate = article.createdAt;
      },
      error: err => {
        this.snackBar.open('Error fetching article.', 'Close');
        throw new Error(err);
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
          this.snackBar.open('Image uploaded successfully.', 'Close', {
            duration: 2000,
          });
        },
        error: err => {
          this.snackBar.open('Image upload failed.', 'Close');
          throw new Error(err);
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
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (this.editorValue === '') {
      this.snackBar.open('Story cannot be empty.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const formValue = this.articleForm.value;

    const article = new Article(
      this.userId,
      this.articleId ?? '',
      this.username,
      formValue.title,
      formValue.titleImage || '',
      formValue.editorContent,
      formValue.tags,
      this.lastUpdatedDate,
      this.createdAtDate
    );

    if (this.isEditMode && this.articleId) {
      this.articleService.updateArticle(this.articleId, article).subscribe({
        next: () => {
          this.snackBar.open('Article updated successfully.', 'Close');
          this.resetForm();
        },
        error: err => {
          this.snackBar.open('Failed to update article.', 'Close');
          throw new Error(err);
        },
      });
    } else {
      this.articleService
        .createArticle(
          article.articleTitle,
          article.articleImage,
          article.articleContent,
          article.articleTags,
          article.lastUpdated
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Article created successfully.', 'Close', {
              duration: 3000,
            });
            this.resetForm();
          },
          error: err => {
            this.snackBar.open('Failed to create article.', 'Close');
            throw new Error(err);
          },
        });
    }
  }
}
