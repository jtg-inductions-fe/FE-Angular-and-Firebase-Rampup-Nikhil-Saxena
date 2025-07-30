import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';

import { AuthService } from '@services/auth.services';
import { LocalStorageService } from '@services/local-storage.service';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
  private localStorage = inject(LocalStorageService);
  private authService = inject(AuthService);
  private snackBarService = inject(SnackbarService);

  // Use signals for reactive state management
  username = signal('');
  email = signal('');
  profileCardDisplay = signal(false); // This will manage the dropdown visibility

  constructor() {
    // Fetch user details from session storage
    const userDetails = this.localStorage.getLocalStorage();

    if (userDetails) {
      this.username.set(userDetails.username);
      this.email.set(userDetails.email);
    }
  }

  // Handle logout
  handleLogout(): void {
    this.authService.logOutUser();
    this.snackBarService.show('Logged Out Successfully');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.authService.getAuthenticationStatus();
  }

  // Toggle the profile card display
  handleToggleProfileCard(): void {
    this.profileCardDisplay.set(!this.profileCardDisplay());
  }
}
