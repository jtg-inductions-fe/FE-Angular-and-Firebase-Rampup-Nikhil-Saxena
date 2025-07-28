// Firebase initialization and service providers for AngularFire

import { initializeApp, FirebaseApp } from '@angular/fire/app';
import { getAuth, Auth } from '@angular/fire/auth';
import { getFirestore, Firestore } from '@angular/fire/firestore';

import { ENVIRONMENT } from '@environments/environment.dev';

/**
 * Initializes the Firebase App instance using the configuration
 * defined in the environment file.
 *
 * @returns {FirebaseApp} A configured Firebase App instance.
 * @throws {Error} If the Firebase config is missing.
 */
export function initializeFirebaseApp(): FirebaseApp {
  if (!ENVIRONMENT.firebaseConfig) {
    throw new Error('Firebase config is missing from environment.ts');
  }
  return initializeApp(ENVIRONMENT.firebaseConfig);
}

/**
 * Provides an instance of Firebase Authentication.
 *
 * @returns {Auth} The Firebase Authentication instance.
 */
export function provideFirebaseAuth(): Auth {
  return getAuth();
}

/**
 * Provides an instance of Firestore (Cloud Firestore database).
 *
 * @returns {Firestore} The Firestore instance.
 */
export function provideFirestore(): Firestore {
  return getFirestore();
}
