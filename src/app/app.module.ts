import { NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideStorage } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouterOutlet } from '@angular/router';

import {
  initializeFirebaseApp,
  provideFirebaseAuth,
  provideFirebaseStorage,
} from '@core/firebase/firebase.config';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeFirebaseApp()),
    provideAuth(() => provideFirebaseAuth()),
    provideStorage(() => provideFirebaseStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
