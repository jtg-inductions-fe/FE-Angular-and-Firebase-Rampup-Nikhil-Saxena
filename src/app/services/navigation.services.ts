import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);

  handleNavigation(link: string) {
    this.router.navigate([`${link}`]);
  }
}
