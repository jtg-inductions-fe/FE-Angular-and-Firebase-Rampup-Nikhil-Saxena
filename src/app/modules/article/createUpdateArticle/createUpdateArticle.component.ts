import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ALL_FIELDS_REQUIRED,
  ARTICLE_CREATE_FAIL,
  ARTICLE_CREATE_SUCCESS,
  ARTICLE_LOAD_FAILED,
  ARTICLE_NOT_FOUND,
  ARTICLE_UNAUTHORIZED_ACCESS,
  ARTICLE_UPDATE_FAIL,
  ARTILE_UPDATE_SUCCESS,
  UPLOAD_FAILED,
  UPLOAD_SUCCESSFULL,
} from '@core/constants/messages.const';
import { Article } from '@core/models/article.model';
import { ArticleTagObjectModel } from '@core/models/articleTag.model';
import { tagsValidator } from '@core/validators/article.validator';
import { ArticleService } from '@services/article.service';
import { ImageService } from '@services/image.service';
import { SnackbarService } from '@services/snackbar.service';
import { LocalStorageService } from '@services/storage.service';
import { blogTags } from '@shared/constants/blogTags';
import { ArticleTagPipe } from '@shared/pipes/articleTagsPipe.pipe';

@Component({
  selector: 'app-create-article',
  templateUrl: './createUpdateArticle.component.html',
  styleUrls: ['./createUpdateArticle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CreateArticleComponent implements OnInit {
  private imageService = inject(ImageService);
  private localStorage = inject(LocalStorageService);
  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBarService = inject(SnackbarService);

  private articleTagPipe = inject(ArticleTagPipe);

  articleForm!: FormGroup;

  autocompleteItems = blogTags;
  editorValue = '';
  selectedFileName = '';
  base64Image: string | null = null;

  username = '';
  userId = '';
  title = '';
  tags: string[] = [];
  lastUpdatedDate: Timestamp | Date | null = new Date();
  createdAtDate: Timestamp | Date = new Date();

  articleId: string | null = null;
  isEditMode = false;

  resetForm(): void {
    this.articleForm.reset();
    this.editorValue = '';
    this.tags = [];
    this.base64Image = null;
    this.selectedFileName = '';
  }

  initiateForm(): void {
    this.articleForm = new FormGroup({
      title: new FormControl('', Validators.required),
      titleImage: new FormControl(''),
      editorContent: new FormControl('', Validators.required),
      tags: new FormControl([], tagsValidator),
    });
  }

  getUserData(): void {
    const user = this.localStorage.getUserData();
    this.username = user?.username || '';
    this.userId = user?.userId || '';
  }

  getRouteParam(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.articleId = id;
        this.isEditMode = true;
        this.fetchArticleById(id);
      }
    });
  }

  articleTagsSubscribe(): void {
    this.articleForm
      .get('tags')
      ?.valueChanges.subscribe((newTags: ArticleTagObjectModel[]) => {
        this.tags = this.articleTagPipe.transform(newTags);
      });
  }

  ngOnInit(): void {
    this.initiateForm();
    this.getUserData();
    this.getRouteParam();
    this.articleTagsSubscribe();
  }

  private fetchArticleById(id: string): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article: Article | null) => {
        if (!article) {
          this.snackBarService.show(ARTICLE_NOT_FOUND);
          this.router.navigate(['/']);
          return;
        }

        if (article.userId !== this.userId) {
          this.snackBarService.show(ARTICLE_UNAUTHORIZED_ACCESS);
          this.router.navigate(['/']);
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
        this.snackBarService.show(ARTICLE_LOAD_FAILED);
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
          this.snackBarService.show(UPLOAD_SUCCESSFULL);
        },
        error: () => {
          this.snackBarService.show(UPLOAD_FAILED);
        },
      });
    }
  }

  handleContentChange(newContent: string): void {
    this.editorValue = newContent;
    this.articleForm.patchValue({ editorContent: newContent });
  }

  updateArticle(): void {
    const formValue = this.articleForm.value;
    const updatedFields = {
      articleTitle: formValue.title,
      articleImage: formValue.titleImage || '',
      articleContent: formValue.editorContent,
      articleTags: formValue.tags,
    };

    if (!this.articleId) return;

    this.articleService.updateArticle(this.articleId, updatedFields).subscribe({
      next: () => {
        this.snackBarService.show(ARTILE_UPDATE_SUCCESS);
        this.resetForm();
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBarService.show(ARTICLE_UPDATE_FAIL);
      },
    });
  }

  createArticle(): void {
    const formValue = this.articleForm.value;
    const newArticle = new Article(
      this.userId,
      '',
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
        this.snackBarService.show(ARTICLE_CREATE_SUCCESS);
        this.resetForm();
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBarService.show(ARTICLE_CREATE_FAIL);
      },
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      this.snackBarService.show(ALL_FIELDS_REQUIRED);
      return;
    }

    if (this.isEditMode && this.articleId) {
      this.updateArticle();
    } else {
      this.createArticle();
    }
  }
}
