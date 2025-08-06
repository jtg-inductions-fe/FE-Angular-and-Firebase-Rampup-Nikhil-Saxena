import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Service for displaying snack bar notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackBarRef = inject(MatSnackBar);

  /**
   * Displays a snack bar message with optional duration.
   * @param message The message to display.
   * @param duration Duration in milliseconds (default: 3000).
   */
  show(message: string, duration: number = 3000): void {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };

    this.snackBarRef.open(message, 'Close', config);
  }
}
