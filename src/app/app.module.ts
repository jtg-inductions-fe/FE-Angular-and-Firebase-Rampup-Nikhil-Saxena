import { NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideDatabase } from '@angular/fire/database';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouterOutlet } from '@angular/router';

import { provideFirebaseDatabase } from '@core/firebase/firebase.config';
import {
  initializeFirebaseApp,
  provideFirebaseAuth,
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
    provideDatabase(() => provideFirebaseDatabase()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
