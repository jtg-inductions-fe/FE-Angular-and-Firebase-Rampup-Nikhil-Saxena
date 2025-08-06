import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service to manage loading state.
 */
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  // Holds the current loading state
  private isLoading = new BehaviorSubject<boolean>(false);

  // Observable for loading state
  public readonly currentSharedLoader: Observable<boolean> =
    this.isLoading.asObservable();

  // Set loading state to false
  setLoadingFalse() {
    this.isLoading.next(false);
  }

  // Set loading state to true
  setLoadingTrue() {
    this.isLoading.next(true);
  }
}
