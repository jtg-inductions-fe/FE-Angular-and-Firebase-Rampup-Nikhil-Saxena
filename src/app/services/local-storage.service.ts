import { Injectable } from '@angular/core';

import { User as AppUser } from '@core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getLocalStorage(): { username: string; email: string } | null {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (username && email) {
      return { username, email };
    }
    return null;
  }

  setUserData(user: AppUser): void {
    localStorage.setItem('username', user.username);
    localStorage.setItem('email', user.email);
  }

  clearUserData(): void {
    localStorage.clear();
  }
}
