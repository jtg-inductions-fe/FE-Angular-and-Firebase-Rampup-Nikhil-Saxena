import { inject, Injectable } from '@angular/core';
import {
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  collection,
} from '@angular/fire/firestore';

import { from, map, Observable, switchMap } from 'rxjs';

import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleTagService {
  private firestore = inject(Firestore);
  private loadingService = inject(LoaderService);

  private readonly tagCollection = 'articleTags';
  private readonly tagId = 'default'; // single document to store all tags

  /**
   * Adds tags to Firestore.
   * If the tag document exists, it merges and appends new tags (deduplicated).
   * If not, it creates a new document with the provided tags.
   *
   * @param tags - Array of tags (strings) to add
   * @returns Observable of the merged tag list
   */
  addTags(tags: string[]): Observable<string[] | null> {
    if (!tags || tags.length === 0) {
      throw new Error('Tags field is empty');
    }

    const tagsCollection: CollectionReference = collection(
      this.firestore,
      this.tagCollection
    ) as CollectionReference;

    const tagDocRef: DocumentReference = doc(tagsCollection, this.tagId);

    return from(getDoc(tagDocRef)).pipe(
      switchMap(docSnap => {
        const existingTags: string[] = docSnap.exists()
          ? docSnap.data()?.['tags'] || []
          : [];

        // Merge and deduplicate tags
        const mergedTags = Array.from(new Set([...existingTags, ...tags]));

        // Save back to Firestore
        return from(setDoc(tagDocRef, { tags: mergedTags })).pipe(
          map(() => mergedTags)
        );
      })
    );
  }

  /**
   * Retrieves the list of tags from Firestore.
   *
   * @returns Observable of string array of tags or null if not found
   */
  getTags(): Observable<string[] | null> {
    this.loadingService.setLoadingTrue();

    const tagsCollection: CollectionReference = collection(
      this.firestore,
      this.tagCollection
    ) as CollectionReference;

    const tagDocRef: DocumentReference = doc(tagsCollection, this.tagId);

    return from(getDoc(tagDocRef)).pipe(
      map(document => {
        this.loadingService.setLoadingFalse();
        if (document.exists()) {
          const data = document.data();
          return data['tags'] as string[];
        }
        return null;
      })
    );
  }
}
