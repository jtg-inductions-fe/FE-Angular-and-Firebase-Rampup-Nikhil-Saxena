import { Injectable } from '@angular/core';

import { ArticleFilters } from '@core/models/article-filters.model';

import { BehaviorSubject, debounceTime, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleFilterAndSearchService {
  private currentFilters = new BehaviorSubject<ArticleFilters>({}); //Default Value for Behavior Subject

  //Exposing a behavior subject directly will breaks encapsulation
  public readonly currentSharedFilter: Observable<ArticleFilters> =
    this.currentFilters.asObservable();

  //Function to update filters
  updateFilters(filters: ArticleFilters) {
    this.currentFilters.next(filters);
  }

  private currentSearchString = new BehaviorSubject<string>(''); //Default Value for Behavior Subject

  //Exposing a behavior subject directly will breaks encapsulation
  public readonly currentSharedSearchString: Observable<string> =
    this.currentSearchString.asObservable().pipe(debounceTime(500));

  //Function to update filters
  updateSearchString(filters: string) {
    this.currentSearchString.next(filters);
  }
}
