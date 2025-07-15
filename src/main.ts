import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    provideFirebaseApp(() => {
      if (!environment.firebaseConfig) {
        throw new Error('Firebase configuration is missing from environment');
      }
      return initializeApp(environment.firebaseConfig);
    }),

    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
});
