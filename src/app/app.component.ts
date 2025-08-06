import { Component, inject, OnInit } from '@angular/core';

import { LoaderService } from '@services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'FE-Angular-and-Firebase-Rampup-Nikhil-Saxena';
  isLoading: boolean = false;

  private loaderService = inject(LoaderService);

  ngOnInit(): void {
    this.loaderService.currentSharedLoader.subscribe(value => {
      this.isLoading = value;
    });
  }
}
