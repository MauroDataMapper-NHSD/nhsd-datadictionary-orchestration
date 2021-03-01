/**
 * Copyright 2021 NHS Digital
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdministrationSessionResponse, SignInError, SignInCredentials, SignInResponse, UserDetails } from '@mdm/services/security/security.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MdmResourcesService } from '../mdm-resources/mdm-resources.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private resources: MdmResourcesService) { }

  /**
   * Sign in a user to the Mauro system.
   * @param credentials The sign-in credentials to use.
   * @returns An observable to return a `UserDetails` object representing the signed in user.
   * @throws `SignInError` in the observable chain if sign-in failed.
   */
  signIn(credentials: SignInCredentials): Observable<UserDetails> {
    // This parameter is very important as we do not want to handle 401 if user credential is rejected on login modal form
    // as if the user credentials are rejected Back end server will return 401, we should not show the login modal form again
    return this.resources.security
      .login(credentials, { login: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(new SignInError(error));
        }),
        switchMap((signInResponse: SignInResponse) =>
          this.resources.session
            .isApplicationAdministration()
            .pipe(
              map((adminResponse: AdministrationSessionResponse) => {
                const signIn = signInResponse.body;
                const admin = adminResponse.body;
                const user: UserDetails = {
                  id: signIn.id,
                  token: signIn.token,
                  firstName: signIn.firstName,
                  lastName: signIn.lastName,
                  userName: signIn.emailAddress,
                  role: signIn.userRole?.toLowerCase() ?? '',
                  isAdmin: admin.applicationAdministrationSession ?? false,
                  needsToResetPassword: signIn.needsToResetPassword ?? false
                };
                this.addUserToLocalStorage(user);
                return user;
              })
            ))
      );
  }

  signOut() {

  }

  getCurrentUser(): UserDetails | null {
    return this.getUserFromLocalStorage();
  }

  private addUserToLocalStorage(user: UserDetails) {
    // Keep username for 100 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    localStorage.setItem('userId', user.id);
    localStorage.setItem('token', user.token ?? '');
    localStorage.setItem('userName', JSON.stringify({ email: user.userName, expiry: expiryDate }));
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    localStorage.setItem('email', JSON.stringify({ email: user.userName, expiry: expiryDate }));
    localStorage.setItem('isAdmin', (user.isAdmin ?? false).toString());
    localStorage.setItem('role', user.role ?? '');
    localStorage.setItem('needsToResetPassword', (user.needsToResetPassword ?? false).toString());
  }

  private getUserFromLocalStorage() {
    const userName = localStorage.getItem('userName');
    if (!userName || userName.length === 0) {
      return null;
    }

    return {
      id: localStorage.getItem('userId') ?? '',
      token: localStorage.getItem('token') ?? undefined,
      firstName: localStorage.getItem('firstName') ?? '',
      lastName: localStorage.getItem('lastName') ?? '',
      userName: userName,
      role: localStorage.getItem('role') ?? undefined,
      isAdmin: Boolean(localStorage.getItem('isAdmin')),
      needsToResetPassword: Boolean(localStorage.getItem('needsToResetPassword'))
    };
  }
}
