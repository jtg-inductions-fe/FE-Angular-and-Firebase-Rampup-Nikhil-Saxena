import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { LOGOUT_MESSAGE } from '@core/constants/messages.const';
import { AuthService } from '@services/auth.services';
import { SnackbarService } from '@services/snackbar.service';
import { LocalStorageService } from '@services/storage.service';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './appBar.component.html',
  styleUrls: ['./appBar.component.scss'],
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

  /**
   * Signal that tracks whether user is logged in, using Firebase auth state.
   */
  isLoggedIn = toSignal(this.authService.getAuthenticationStatus(), {
    initialValue: false,
  });

  getUserDetails(): void {
    // Get stored user details from local storage (if any)
    const userDetails = this.localStorage.getUserData();

    // Update the signals if user details exist
    if (userDetails) {
      this.username.set(userDetails.username);
      this.email.set(userDetails.email);
    }
  }

  constructor() {
    this.getUserDetails();
  }

  /**
   * Logs out the user by calling the AuthService and shows a snackbar message.
   */
  handleLogout(): void {
    this.authService.logOutUser();
    this.snackBarService.show(LOGOUT_MESSAGE);
  }

  /**
   * Toggles the profile card dropdown visibility.
   */
  handleToggleProfileCard(): void {
    this.profileCardDisplay.set(!this.profileCardDisplay());
  }
}
