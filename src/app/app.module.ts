import { NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouterOutlet } from '@angular/router';

import {
  initializeFirebaseApp,
  provideFirebaseAuth,
  provideFirestore as provideCustomFirestore,
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
    provideFirestore(() => provideCustomFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
