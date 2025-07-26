// Firebase initialization and service providers for AngularFire

import { initializeApp, FirebaseApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';

import { environment } from '@environments/environment.dev';

/**
 * Initializes the Firebase App instance using the configuration
 * defined in the environment file.
 *
 * @returns {FirebaseApp} A configured Firebase App instance.
 * @throws {Error} If the Firebase config is missing.
 */
export function initializeFirebaseApp(): FirebaseApp {
  if (!environment.firebaseConfig) {
    throw new Error('Firebase config is missing from environment.ts');
  }
  return initializeApp(environment.firebaseConfig);
}

/**
 * Provides an instance of Firebase Authentication.
 *
 * @returns {Auth} The Firebase Authentication instance.
 */
export function provideFirebaseAuth() {
  return getAuth();
}

/**
 * Provides an instance of Firestore (Cloud Firestore database).
 *
 * @returns {Firestore} The Firestore instance.
 */
export function provideFirestore() {
  return getFirestore();
}
