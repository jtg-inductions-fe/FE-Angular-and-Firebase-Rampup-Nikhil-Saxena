import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';

import { Article as AppArticle } from '@core/models/article.model';

import { from, map, Observable } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private firestore = inject(Firestore);
  private localStorage = inject(LocalStorageService);

  private userId = this.localStorage.getLocalStorage()?.userId;
  private username = this.localStorage.getLocalStorage()?.username;

  /**
   * Returns the Firestore collection reference for articles.
   */
  private get articlesCollection(): CollectionReference {
    return collection(this.firestore, 'articles') as CollectionReference;
  }

  /**
   * Creates a new article and stores it in Firestore.
   *
   * @param articleTitle - Title of the article
   * @param articleImage - Image URL of the article
   * @param articleContent - Content/body of the article
   * @param articleTags - Array of tags related to the article
   * @param lastUpdated - Date when the article was last updated
   * @returns An observable emitting the created `AppArticle` object
   */
  createArticle(
    articleTitle: string,
    articleImage: string,
    articleContent: string,
    articleTags: string[],
    lastUpdated: Date
  ): Observable<AppArticle> {
    if (!this.username || !this.userId) {
      throw new Error('Username or userId is missing.');
    }

    const articleId = Date.now().toString();
    const createdAt = new Date();

    const articleData: AppArticle = new AppArticle(
      this.userId,
      articleId,
      this.username,
      articleTitle,
      articleImage,
      articleContent,
      articleTags,
      lastUpdated,
      createdAt
    );

    const articleDocRef: DocumentReference = doc(
      this.articlesCollection,
      articleId
    );

    return from(setDoc(articleDocRef, { ...articleData })).pipe(
      map(() => articleData)
    );
  }

  /**
   * Fetches a single article by its ID.
   *
   * @param articleId - The unique ID of the article to fetch
   * @returns An observable emitting the `AppArticle` if found, or `null` otherwise
   */
  getArticleById(articleId: string): Observable<AppArticle | null> {
    const articleDocRef = doc(this.articlesCollection, articleId);

    return from(getDoc(articleDocRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data() as AppArticle;

          return new AppArticle(
            data.userId,
            articleId,
            data.articleUsername,
            data.articleTitle,
            data.articleImage,
            data.articleContent,
            data.articleTags,
            new Date(data.lastUpdated),
            new Date(data.createdAt)
          );
        }
        return null;
      })
    );
  }

  /**
   * Updates fields of an existing article in Firestore.
   *
   * @param articleId - The ID of the article to update
   * @param updates - Partial updates to apply (e.g. title, content, image, tags)
   * @returns An observable that completes when the update is done
   */
  updateArticle(
    articleId: string,
    updates: Partial<
      Omit<AppArticle, 'articleId' | 'userId' | 'articleUsername' | 'createdAt'>
    >
  ): Observable<void> {
    const articleDocRef = doc(this.articlesCollection, articleId);

    const updatedData = {
      ...updates,
      lastUpdated: new Date(),
    };

    return from(updateDoc(articleDocRef, updatedData));
  }
}
