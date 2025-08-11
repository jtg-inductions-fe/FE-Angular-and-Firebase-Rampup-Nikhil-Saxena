import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { AUTH_TOKEN_EXPIRATION_TIME } from '@core/constants/auth.const';
import { User as AppUser } from '@core/models/user.model';
import { CookieService } from 'ngx-cookie-service';

import {
  from,
  switchMap,
  catchError,
  throwError,
  Observable,
  BehaviorSubject,
} from 'rxjs';

import { LocalStorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private localStorage = inject(LocalStorageService);
  private cookieService = inject(CookieService);
  private routerService = inject(Router);
  private authStatus$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Initialize auth state listener
    onAuthStateChanged(this.auth, user => {
      this.authStatus$.next(!!user);
    });
  }

  /**
   * Saves the Firebase ID token in a cookie with 2-day expiration.
   * @param tokenCookie - Firebase Auth token.
   */
  private handleTokenCookieSave(tokenCookie: string) {
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() + AUTH_TOKEN_EXPIRATION_TIME
    );
    this.cookieService.set('Authorization', tokenCookie, expirationDate, '/');
  }

  /**
   * Registers a new user if the email is not already taken.
   * Saves the user info in Firestore and stores auth token in cookie.
   * @param email - User email.
   * @param password - User password.
   * @param username - Username to associate with account.
   * @returns Observable of UserCredential on success.
   */
  registerUser(
    email: string,
    password: string,
    username: string
  ): Observable<UserCredential> {
    return from(getDocs(collection(this.firestore, 'users'))).pipe(
      switchMap(document => {
        const userExists = document.docs.some(
          documentData => (documentData.data() as AppUser).email === email
        );

        if (userExists) {
          return throwError(
            () => new Error('User with this email already exists.')
          );
        }

        return from(
          createUserWithEmailAndPassword(this.auth, email, password)
        ).pipe(
          switchMap((userCredential: UserCredential) => {
            const { uid } = userCredential.user;

            return from(userCredential.user.getIdToken()).pipe(
              switchMap((idToken: string) => {
                this.handleTokenCookieSave(idToken);

                const userData: AppUser = {
                  userId: uid,
                  email,
                  username,
                  createdAt: new Date(),
                };

                this.localStorage.setUserData(userData);

                return from(
                  setDoc(doc(this.firestore, 'users', uid), userData)
                ).pipe(switchMap(() => from([userCredential])));
              })
            );
          })
        );
      }),
      catchError(error => throwError(() => error))
    );
  }

  /**
   * Authenticates the user with email and password.
   * Retrieves user data from Firestore and saves token in cookie.
   * @param email - User email.
   * @param password - User password.
   * @returns Observable of the authenticated AppUser.
   */
  loginUser(email: string, password: string): Observable<AppUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) => {
        const { uid } = userCredential.user;

        return from(userCredential.user.getIdToken()).pipe(
          switchMap((idToken: string) => {
            this.handleTokenCookieSave(idToken);

            return from(getDoc(doc(this.firestore, 'users', uid))).pipe(
              switchMap(document => {
                if (document.exists()) {
                  const userData = document.data() as AppUser;
                  this.localStorage.setUserData(userData);
                  return from([{ ...userData, uid, email }]);
                } else {
                  return throwError(
                    () => new Error('User data not found in Firestore.')
                  );
                }
              })
            );
          })
        );
      }),
      catchError(error => throwError(() => error))
    );
  }

  /**
   * Logs out the user by removing auth cookie and clearing local storage.
   * Navigates to the login page.
   */
  logOutUser(): void {
    signOut(this.auth)
      .then(() => {
        this.cookieService.delete('Authorization', '/');
        this.localStorage.clearUserData();
        this.routerService.navigate(['/auth/login']);
      })
      .catch(error => {
        throwError(() => error);
      });
  }

  /**
   * Returns observable of authentication status
   */
  getAuthenticationStatus(): Observable<boolean> {
    return this.authStatus$.asObservable();
  }

  /**
   * Returns current authentication status as a boolean
   */
  getCurrentAuthenticationStatus(): boolean {
    return this.cookieService.check('Authorization');
  }
}
