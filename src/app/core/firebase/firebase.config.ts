import { initializeApp, FirebaseApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getDatabase } from '@angular/fire/database';

import { environment } from '@environments/environment.dev';

export function initializeFirebaseApp(): FirebaseApp {
  if (!environment.firebaseConfig) {
    throw new Error('Firebase config is missing from environment.ts');
  }
  return initializeApp(environment.firebaseConfig);
}

export function provideFirebaseAuth() {
  return getAuth();
}

export function provideFirebaseDatabase() {
  return getDatabase();
}
