import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { signal } from '@angular/core';

import { AuthService } from '@services/auth.services';
import { LocalStorageService } from '@services/local-storage.service';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBarComponent {
  // Inject services using Angular's `inject()` function
  private localStorage = inject(LocalStorageService);
  private authService = inject(AuthService);
  private snackBarService = inject(SnackbarService);

  /**
   * Stores the logged-in user's username.
   */
  username = signal('');

  /**
   * Stores the logged-in user's email.
   */
  email = signal('');

  /**
   * Controls visibility of the profile dropdown card.
   */
  profileCardDisplay = signal(false);

  constructor() {
    // Get stored user details from local storage (if any)
    const userDetails = this.localStorage.getLocalStorage();

    // Update the signals if user details exist
    if (userDetails) {
      this.username.set(userDetails.username);
      this.email.set(userDetails.email);
    }
  }

  /**
   * Logs out the user by calling the AuthService and shows a snackbar message.
   */
  handleLogout(): void {
    this.authService.logOutUser();
    this.snackBarService.show('Logged Out Successfully');
  }

  /**
   * Returns `true` if the user is currently authenticated.
   */
  isLoggedIn(): boolean {
    return this.authService.getAuthenticationStatus();
  }

  /**
   * Toggles the profile card dropdown visibility.
   */
  handleToggleProfileCard(): void {
    this.profileCardDisplay.set(!this.profileCardDisplay());
  }
}
