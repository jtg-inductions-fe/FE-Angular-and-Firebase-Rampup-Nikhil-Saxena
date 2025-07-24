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

  private get articlesCollection(): CollectionReference {
    return collection(this.firestore, 'articles') as CollectionReference;
  }

  /**
   * Creates a new article document in Firestore.
   * @param articleTitle Title of the article
   * @param articleImage Image URL
   * @param articleContent Body content
   * @param articleTags Tags array
   * @param lastUpdated Last update timestamp (ISO)
   * @returns Observable of the created article or error
   */
  createArticle(
    articleTitle: string,
    articleImage: string,
    articleContent: string,
    articleTags: string[],
    lastUpdated: string
  ): Observable<AppArticle> {
    if (!this.username || !this.userId) {
      throw new Error('Username or userId is missing.');
    }

    const articleId = Date.now().toString();
    const createdAt = new Date().toISOString();

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
    const plainArticleData = { ...articleData };

    return from(setDoc(articleDocRef, plainArticleData)).pipe(
      map(() => articleData)
    );
  }

  /**
   * Retrieves an article document from Firestore by ID.
   * @param articleId ID of the article
   * @returns Observable of the retrieved article or null
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
            data.lastUpdated,
            data.createdAt
          );
        }
        return null;
      })
    );
  }

  /**
   * Updates fields of an existing article in Firestore.
   * @param articleId ID of the article to update
   * @param updates Partial object with allowed fields to update
   * @returns Observable of the update operation
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
      lastUpdated: new Date().toISOString(),
    };

    return from(updateDoc(articleDocRef, updatedData));
  }
}
