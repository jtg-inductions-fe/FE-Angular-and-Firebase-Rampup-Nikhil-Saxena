import { Injectable } from '@angular/core';
import { User as AppUser } from '@core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  getSessionStorage(): { username: string; email: string } | null {
    const username = sessionStorage.getItem('username');
    const email = sessionStorage.getItem('email');

    if (username && email) {
      return { username, email };
    }
    return null;
  }

  setUserData(user: AppUser): void {
    sessionStorage.setItem('username', user.username);
    sessionStorage.setItem('email', user.email);
  }

  clearUserData(): void {
    sessionStorage.clear();
  }
}
