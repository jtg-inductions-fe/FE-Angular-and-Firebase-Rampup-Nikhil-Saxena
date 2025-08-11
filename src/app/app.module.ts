import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppBarComponent } from '@core/components/appBar/appBar.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { LoaderComponent } from '@core/components/loader/loader.component';
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
    AppBarComponent,
    FooterComponent,
    LoaderComponent,
  ],
  providers: [
    provideFirebaseApp(() => initializeFirebaseApp()),
    provideAuth(() => provideFirebaseAuth()),
    provideFirestore(() => provideCustomFirestore()),
    provideHttpClient(),
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
