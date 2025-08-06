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
  query,
  getDocs,
  where,
  limit,
  deleteDoc,
  orderBy,
  DocumentSnapshot,
  DocumentData,
  startAfter,
} from '@angular/fire/firestore';
import type { Query, Timestamp } from '@angular/fire/firestore';

import { ArticleFilters } from '@core/models/article-filters.model';
import { Article as AppArticle } from '@core/models/article.model';

import { from, map, Observable, switchMap } from 'rxjs';

import { LoaderService } from './loader.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private firestore = inject(Firestore);
  private localStorage = inject(LocalStorageService);
  private loaderService = inject(LoaderService);

  private userId = this.localStorage.getUserData()?.userId;
  private username = this.localStorage.getUserData()?.username;

  /**
   * Converts a Firestore Timestamp or JS Date to a normalized JS Date (00:00:00).
   *
   * @param value - A Date or Firestore Timestamp object
   * @returns Normalized JavaScript Date object
   */
  private dateTimestampTransform(value: Date | Timestamp): Date {
    if (!value) {
      return new Date();
    }
    if (value instanceof Date) {
      return value as Date;
    } else {
      return new Date(
        new Date((value as Timestamp).seconds * 1000).setHours(0, 0, 0, 0)
      );
    }
  }

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
  createArticle(article: AppArticle): Observable<AppArticle> {
    if (!this.username || !this.userId) {
      throw new Error('Username or userId is missing.');
    }

    const articleId = Date.now().toString();
    const createdAt = new Date();

    const articleData: AppArticle = new AppArticle(
      this.userId,
      articleId,
      this.username,
      article.articleTitle,
      article.articleImage,
      article.articleContent,
      article.articleTags,
      article.lastUpdated,
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
    this.loaderService.setLoadingTrue();
    const articleDocRef = doc(this.articlesCollection, articleId);

    return from(getDoc(articleDocRef)).pipe(
      map(snapshot => {
        this.loaderService.setLoadingFalse();
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
            this.dateTimestampTransform(data.createdAt),
            this.dateTimestampTransform(data.lastUpdated)
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

  /**
   * Get All existing Articles in Firestore
   * @returns Observable to get Article List.
   */

  getAllArticle(
    lastVisibleDoc?: DocumentSnapshot<DocumentData>,
    //will add pagination later
    articlesLimit: number = 1000
  ): Observable<{
    articles: AppArticle[];
    lastDoc: DocumentSnapshot<DocumentData> | null;
  }> {
    this.loaderService.setLoadingTrue();
    let articlesQuery = query(this.articlesCollection);

    // Apply pagination cursor
    if (lastVisibleDoc) {
      articlesQuery = query(articlesQuery, startAfter(lastVisibleDoc));
    }

    // Apply final limit
    articlesQuery = query(articlesQuery, limit(articlesLimit));

    // Execute query
    return from(getDocs(articlesQuery)).pipe(
      map(snapshot => {
        this.loaderService.setLoadingFalse();
        if (snapshot.empty) {
          return { articles: [], lastDoc: null };
        }

        const articles: AppArticle[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as AppArticle;

          return new AppArticle(
            data.userId,
            docSnap.id,
            data.articleUsername,
            data.articleTitle,
            data.articleImage,
            data.articleContent,
            data.articleTags,
            this.dateTimestampTransform(data.createdAt),
            this.dateTimestampTransform(data.lastUpdated)
          );
        });

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];

        return { articles, lastDoc };
      })
    );
  }

  /**
   * Fetches articles for the current user with filtering, sorting, searching, and pagination support.
   *
   * @param articlesLimit - Maximum number of articles to fetch
   * @param sortArray - Sorting rules (array of { colId, sort })
   * @param articleFilters - Filters like tags, date ranges
   * @param searchString - Optional search string for articleTitle
   * @param lastVisibleDoc - Cursor for pagination
   * @returns Observable emitting fetched articles and last document for pagination
   */
  getAllArticlesByUserIdWithOptions(
    articlesLimit: number,
    sortArray: { colId: string; sort: 'asc' | 'desc' }[] = [],
    articleFilters?: ArticleFilters,
    searchString?: string,
    lastVisibleDoc?: DocumentSnapshot<DocumentData>
  ): Observable<{
    articles: AppArticle[];
    lastDoc: DocumentSnapshot<DocumentData> | null;
  }> {
    if (!lastVisibleDoc) this.loaderService.setLoadingTrue();
    // Define the collection reference
    const articlesRef = this.articlesCollection;

    const currentUserId = this.userId;
    if (!currentUserId) {
      throw new Error('User ID is required for fetching articles');
    }

    // Initial query with user filter
    let articlesQuery: Query<DocumentData> = query(
      articlesRef,
      where('userId', '==', currentUserId)
    );

    // Add orderBy clauses based on sortArray
    sortArray.forEach(sort => {
      const { colId, sort: order } = sort;
      articlesQuery = query(articlesQuery, orderBy(colId, order));
    });

    // Firestore requires at least one orderBy if using startAfter
    if (sortArray.length === 0) {
      articlesQuery = query(articlesQuery, orderBy('createdAt', 'desc'));
    }

    // Apply pagination cursor
    if (lastVisibleDoc) {
      articlesQuery = query(articlesQuery, startAfter(lastVisibleDoc));
    }

    // Apply Custom Filters
    if (articleFilters) {
      if (articleFilters.tags && articleFilters.tags.length > 0) {
        articlesQuery = query(
          articlesQuery,
          where('articleTags', 'array-contains-any', articleFilters.tags)
        );
      }

      if (articleFilters.createdAtRange?.start) {
        articlesQuery = query(
          articlesQuery,
          where('createdAt', '>=', articleFilters.createdAtRange.start)
        );
      }

      if (articleFilters.createdAtRange?.end) {
        // To make the range inclusive of last date
        articleFilters.createdAtRange.end.setDate(
          articleFilters.createdAtRange.end.getDate() + 1
        );
        articlesQuery = query(
          articlesQuery,
          where('createdAt', '<=', articleFilters.createdAtRange.end)
        );
      }

      if (articleFilters.lastUpdatedRange?.start) {
        articlesQuery = query(
          articlesQuery,
          where('lastUpdated', '>=', articleFilters.lastUpdatedRange.start)
        );
      }

      if (articleFilters.lastUpdatedRange?.end) {
        articleFilters.lastUpdatedRange.end.setDate(
          articleFilters.lastUpdatedRange.end.getDate() + 1
        );
        articlesQuery = query(
          articlesQuery,
          where('lastUpdated', '<', articleFilters.lastUpdatedRange.end)
        );
      }
    }

    if (searchString && searchString != '') {
      articlesQuery = query(
        articlesQuery,
        where('articleTitle', '>=', searchString),
        where('articleTitle', '<=', searchString + '\uf8ff')
      );
    }

    // Apply final limit
    articlesQuery = query(articlesQuery, limit(articlesLimit));

    // Execute query
    return from(getDocs(articlesQuery)).pipe(
      map(snapshot => {
        this.loaderService.setLoadingFalse();
        if (snapshot.empty) {
          return { articles: [], lastDoc: null };
        }

        const articles: AppArticle[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as AppArticle;

          return new AppArticle(
            data.userId,
            docSnap.id,
            data.articleUsername,
            data.articleTitle,
            data.articleImage,
            data.articleContent,
            data.articleTags,
            this.dateTimestampTransform(data.createdAt),
            this.dateTimestampTransform(data.lastUpdated)
          );
        });

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];

        return { articles, lastDoc };
      })
    );
  }

  /**
   * Deletes an article by its ID.
   *
   * @param articleId - The ID of the article to delete
   * @returns An observable that completes when deletion is done
   */
  deleteArticleById(articleId: string): Observable<void> {
    const currentUserId = this.userId;
    if (!currentUserId) {
      throw new Error('User must be authenticated to delete articles');
    }

    // First verify the user owns this article
    return this.getArticleById(articleId).pipe(
      switchMap(article => {
        if (!article) {
          throw new Error('Article not found');
        }
        if (article.userId !== currentUserId) {
          throw new Error(
            'Unauthorized: Cannot delete article owned by another user'
          );
        }

        const articleDocRef = doc(this.articlesCollection, articleId);
        return from(deleteDoc(articleDocRef));
      })
    );
  }
}
