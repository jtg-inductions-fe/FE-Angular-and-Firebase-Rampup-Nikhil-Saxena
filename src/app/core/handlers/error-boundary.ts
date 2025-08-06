// core/handlers/global-error.handler.ts
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NgZone } from '@angular/core';

import { NavigationService } from '@services/navigation.services';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private ngZone = inject(NgZone);
  private navigationService = inject(NavigationService);

  handleError(): void {
    this.navigationService.handleNavigation('/something-went-wrong');
    // Optional: Use NgZone to trigger UI updates
    this.ngZone.run(() => {
      alert('Something went wrong.');
    });
  }
}
