import { inject, Injectable } from '@angular/core';

import { User as AppUser } from '@core/models/user.model';

import { NavigationService } from './navigation.services';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private navigationService = inject(NavigationService);
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  /**
   * Retrieves user data from local storage.
   * If any required field is missing, navigates to the login page.
   *
   * @returns An object containing username, email, and userId, or null if not found.
   */

  getLocalStorage(): AppUser | null {
    if (!this.isBrowser()) return null;

    try {
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      const userId = localStorage.getItem('userId');

      if (username && email && userId) return { username, email, userId };
      else throw new Error('User Data Not Found');
    } catch {
      this.navigationService.handleNavigation('/auth/login');
    } finally {
      return null;
    }
  }

  /**
   * Stores user data in local storage.
   *
   * @param user - The user object containing userId, username, and email.
   */

  setUserData(user: AppUser): void {
    if (!this.isBrowser()) return;

    try {
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
      localStorage.setItem('userId', user.userId);
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  }

  /**
   * Clears all user-related data from local storage.
   */

  clearUserData(): void {
    if (!this.isBrowser()) return;

    try {
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}
