import { NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {
  initializeFirebaseApp,
  provideFirebaseAuth,
  provideFirestore as provideCustomFirestore,
} from '@core/firebase/firebase.config';

import { AppComponent } from './app.component';
import { ROUTE_REF } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTE_REF),
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
