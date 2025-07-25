import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  Database,
  ref,
  set,
  get,
  child,
  DataSnapshot,
} from '@angular/fire/database';

import { User as AppUser } from '@core/models/user.model';
import { CookieService } from 'ngx-cookie-service';

import { from, switchMap, catchError, throwError, Observable } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private db = inject(Database);
  private localStorage = inject(LocalStorageService);
  private cookieService = inject(CookieService);

  // Consider making this method private if only used internally
  private handleTokenCookieSave(tokenCookie: string) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 2 * 24 * 60 * 60 * 1000);

    this.cookieService.set('Authorization', tokenCookie, expirationDate, '/');
  }

  registerUser(
    email: string,
    password: string,
    username: string
  ): Observable<UserCredential> {
    // Explicitly define return type as Observable
    const dbRef = ref(this.db);

    // Check if email already exists in DB
    return from(get(child(dbRef, 'users'))).pipe(
      switchMap((snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          const userExists = (Object.values(users) as AppUser[]).some(
            user => user.email === email
          );

          if (userExists) {
            const errorMsg =
              'User with this email already exists in the database.';
            return throwError(() => new Error(errorMsg));
          }
        }

        // Create Firebase Auth user
        return from(
          createUserWithEmailAndPassword(this.auth, email, password)
        ).pipe(
          switchMap((userCredential: UserCredential) => {
            const { uid } = userCredential.user;

            // Get the Firebase ID Token (JWT) using getIdToken()
            return from(userCredential.user.getIdToken()).pipe(
              switchMap((idToken: string) => {
                this.handleTokenCookieSave(idToken); // Save the actual ID Token

                const userData: AppUser = {
                  uid,
                  email,
                  username,
                  createdAt: new Date().toISOString(),
                };

                this.localStorage.setUserData(userData);

                // Save user data to Realtime DB
                return from(set(ref(this.db, `users/${uid}`), userData)).pipe(
                  // After setting, we complete the Observable with the original userCredential
                  switchMap(() => from([userCredential])) // Wrap userCredential in 'from' to make it an Observable
                );
              })
            );
          })
        );
      }),
      catchError(error => {
        // It's good practice to re-throw the error as an Observable
        return throwError(() => error);
      })
    );
  }

  loginUser(email: string, password: string): Observable<AppUser> {
    // Explicitly define return type
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) => {
        const { uid } = userCredential.user; // Destructure email directly

        // Get the Firebase ID Token (JWT) using getIdToken()
        return from(userCredential.user.getIdToken()).pipe(
          switchMap((idToken: string) => {
            this.handleTokenCookieSave(idToken); // Save the actual ID Token

            // Get user data from Realtime DB
            return from(get(ref(this.db, `users/${uid}`))).pipe(
              switchMap((snapshot: DataSnapshot) => {
                if (snapshot.exists()) {
                  const userData = snapshot.val() as AppUser;
                  this.localStorage.setUserData(userData);
                  // Ensure 'uid' and 'email' are present in the returned user data if not directly from DB
                  return from([{ ...userData, uid, email }]);
                } else {
                  return throwError(
                    () => new Error('User data not found in database.')
                  );
                }
              })
            );
          })
        );
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logOutUser(): void {
    this.cookieService.delete('Authorization', '/');
    this.localStorage.clearUserData();
  }

  getAuthenticationStatus(): boolean {
    return this.cookieService.get('Authorization') != '';
  }
}
