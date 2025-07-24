import { environment } from '@environments/environment.dev';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export function initializeFirebaseApp(): FirebaseApp {
  if (!environment.firebaseConfig) {
    throw new Error('Firebase config is missing from environment.ts');
  }
  return initializeApp(environment.firebaseConfig);
}

export function provideFirebaseAuth() {
  return getAuth();
}

export function provideFirebaseStorage() {
  return getStorage();
}
