import { Injectable, inject } from '@angular/core';

import { User as AppUser } from '@core/models/user.model';

import { NavigationService } from './navigation.services';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private navigate = inject(NavigationService);
  private snackbarService = inject(SnackbarService);

  /**
   * Retrieves user data from local storage.
   * If any required field is missing, navigates to the login page.
   *
   * @returns An object containing username, email, and userId, or null if not found.
   */
  getUserData(): {
    username: string;
    email: string;
    userId: string;
  } | null {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');

    if (username && email && userId) {
      return { username, email, userId };
    } else {
      this.navigate.handleNavigation('/auth/login');
    }
    return null;
  }

  /**
   * Stores user data in local storage.
   *
   * @param user - The user object containing userId, username, and email.
   */
  setUserData(user: AppUser): void {
    try {
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
    } catch (error) {
      this.snackbarService.show('Failed to save user data to localstorage');
    }
  }

  /**
   * Clears all user-related data from local storage.
   */
  clearUserData(): void {
    localStorage.clear();
  }
}
