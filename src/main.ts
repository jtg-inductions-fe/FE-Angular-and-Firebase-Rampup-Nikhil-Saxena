import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { environment } from './environments/environment';
import { Environment } from '@environments/environment.model';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    provideFirebaseApp(() =>
      initializeApp((environment as Environment).firebaseConfig)
    ),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
});
