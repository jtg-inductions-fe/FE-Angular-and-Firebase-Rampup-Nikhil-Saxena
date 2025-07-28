import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from '@angular/fire/firestore';

import { User as AppUser } from '@core/models/user.model';
import { CookieService } from 'ngx-cookie-service';

import { from, switchMap, catchError, throwError, Observable } from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { NavigationService } from './navigation.services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private localStorage = inject(LocalStorageService);
  private cookieService = inject(CookieService);
  private navigate = inject(NavigationService);

  /**
   * Saves the Firebase ID token in a cookie with 2-day expiration.
   * @param tokenCookie - Firebase Auth token.
   */
  private handleTokenCookieSave(tokenCookie: string) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 2 * 24 * 60 * 60 * 1000);
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
      switchMap(snapshot => {
        const userExists = snapshot.docs.some(
          document => (document.data() as AppUser).email === email
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
              switchMap(snapshot => {
                if (snapshot.exists()) {
                  const userData = snapshot.data() as AppUser;
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
    this.cookieService.delete('Authorization', '/');
    this.localStorage.clearUserData();
    this.navigate.handleNavigation('/auth/login');
  }

  /**
   * Checks whether an auth token cookie is present to determine authentication.
   * @returns Boolean indicating authentication status.
   */
  getAuthenticationStatus(): boolean {
    return this.cookieService.get('Authorization') !== '';
  }
}
