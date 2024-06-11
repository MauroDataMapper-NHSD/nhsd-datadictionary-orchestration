/*
Copyright 2021-2024 NHS England

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
*/

import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  AdministrationSessionResponse,
  SignInError,
  SignInResponse,
  UserDetails,
  AuthenticatedSessionResponse,
  AuthenticatedSessionError,
  SignInPayload
} from '@mdm/core/security/security.model';
import { MdmResourcesService } from '@mdm/mdm-resources/mdm-resources/mdm-resources.service';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { MdmResourcesError } from '../../mdm-resources/mdm-resources/mdm-resources.model';
import {
  PublicOpenIdConnectProvider,
  PublicOpenIdConnectProvidersIndexResponse
} from '@maurodatamapper/mdm-resources';
import {
  OPENID_CONNECT_CONFIG,
  OpenIdConnectConfiguration,
  OpenIdConnectSession
} from './security.types';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  constructor(
    private resources: MdmResourcesService,
    @Optional()
    @Inject(OPENID_CONNECT_CONFIG)
    private openIdConnectConfig: OpenIdConnectConfiguration
  ) {}

  /**
   * Sign in a user to the Mauro system.
   *
   * @param credentials The sign-in credentials to use.
   * @returns An observable to return a `UserDetails` object representing the signed in user.
   * @throws `SignInError` in the observable chain if sign-in failed.
   */
  signIn(credentials: SignInPayload): Observable<UserDetails> {
    // This parameter is very important as we do not want to handle 401 if user credential is rejected on login modal form
    // as if the user credentials are rejected Back end server will return 401, we should not show the login modal form again
    return this.resources.security.login(credentials, { login: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new SignInError(error));
      }),
      switchMap((signInResponse: SignInResponse) =>
        this.resources.session.isApplicationAdministration().pipe(
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
        )
      )
    );
  }

  /**
   * Sign the current user out of the Mauro system.
   *
   * @returns An `Observable<never>` to subscribe to when sign out is successful.
   * @throws `MdmResourcesError` in the observable stream if sign-out failed.
   */
  signOut(): Observable<void> {
    return this.resources.security.logout({ responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new MdmResourcesError(error));
      }),
      map(() => {}),
      finalize(() => {
        this.removeUserFromLocalStorage();
      })
    );
  }

  /**
   * Check if the current user session is authenticated. Will return `true` if signed in and the session
   * is still active.
   *
   * @returns An observable returning a boolean stating if the current session is authenticated.
   * @throws `MdmResourcesError` in the observable stream if the request failed.
   */
  isAuthenticated(): Observable<boolean> {
    return this.resources.session.isAuthenticated().pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(new AuthenticatedSessionError(error))
      ),
      map((response: AuthenticatedSessionResponse) => response.body.authenticatedSession)
    );
  }

  /**
   * Gets the current user signed in.
   *
   * @returns A `UserDetails` containing the current signed in user details, or `null` if not signed in.
   */
  getCurrentUser(): UserDetails | null {
    return this.getUserFromLocalStorage();
  }

  /**
   * Determines if the current user is signed in.
   *
   * @returns True if the current user is signed in.
   */
  isSignedIn(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * Check if the current session is expired. If not signed in this returns `false`.
   *
   * @returns An observable that returns `true` if the current session has expired.
   */
  isCurrentSessionExpired(): Observable<boolean> {
    if (!this.getCurrentUser()) {
      return of(false);
    }

    return this.isAuthenticated().pipe(
      catchError((error: AuthenticatedSessionError) => {
        if (error.invalidated) {
          this.removeUserFromLocalStorage();
          return of(true);
        }

        return of(false);
      }),
      tap((authenticated) => {
        if (!authenticated) {
          this.removeUserFromLocalStorage();
        }
      })
    );
  }

  /**
   * Get all available OpenID Connect providers. If not available or not configured, this will return an empty
   * observable.
   */
  getOpenIdConnectProviders(): Observable<PublicOpenIdConnectProvider[]> {
    // If unable to get OpenID Connect providers, silently fail and ignore
    const requestOptions = {
      handleGetErrors: false
    };

    return this.resources.pluginOpenIdConnect.listPublic({}, requestOptions).pipe(
      catchError(() => EMPTY),
      map((response: PublicOpenIdConnectProvidersIndexResponse) => response.body)
    );
  }

  /**
   * Get the authorization URL for an OpenID Connect provider.
   *
   * @param provider The OpenID Connect provider to redirect to.
   * @returns The authorization URL to redirect to.
   *
   * @see {@link SecurityService.authorizeOpenIdConnectSession}
   */
  getOpenIdConnectAuthorizationUrl(provider: PublicOpenIdConnectProvider): URL {
    if (!this.openIdConnectConfig) {
      throw new Error(
        'OPENID_CONNECT_CONFIG injection token is missing - requires redirectUrl to come back to'
      );
    }

    const authorizeUrl = new URL(provider.authorizationEndpoint);

    // Set the page URL to come back to once the provider has authenticated the user
    const redirectUri = this.openIdConnectConfig.redirectUrl;
    authorizeUrl.searchParams.append('redirect_uri', redirectUri);

    return authorizeUrl;
  }

  /**
   * Log in a user that was authenticated via an OpenID Connect provider.
   *
   * @param params The session state parameters provided by the OpenID Connect provider.
   * @returns An observable to return a `UserDetails` object representing the signed in user.
   * @throws `SignInError` in the observable chain if sign-in failed.
   *
   * @see {@link SecurityHandlerService.authenticateWithOpenIdConnect}
   */
  authorizeOpenIdConnectSession(params: OpenIdConnectSession): Observable<UserDetails> {
    return this.signIn({
      openidConnectProviderId: params.providerId,
      state: params.state,
      sessionState: params.sessionState,
      code: params.code,
      redirectUri: this.openIdConnectConfig.redirectUrl.toString()
    });
  }

  private addUserToLocalStorage(user: UserDetails) {
    // Keep username for 100 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    localStorage.setItem('userId', user.id);
    localStorage.setItem('token', user.token ?? '');
    localStorage.setItem(
      'userName',
      JSON.stringify({ email: user.userName, expiry: expiryDate })
    );
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    localStorage.setItem(
      'email',
      JSON.stringify({ email: user.userName, expiry: expiryDate })
    );
    localStorage.setItem('isAdmin', (user.isAdmin ?? false).toString());
    localStorage.setItem('role', user.role ?? '');
    localStorage.setItem(
      'needsToResetPassword',
      (user.needsToResetPassword ?? false).toString()
    );
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
      userName,
      role: localStorage.getItem('role') ?? undefined,
      isAdmin: Boolean(localStorage.getItem('isAdmin')),
      needsToResetPassword: Boolean(localStorage.getItem('needsToResetPassword'))
    };
  }

  private removeUserFromLocalStorage() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('role');
    localStorage.removeItem('needsToResetPassword');
  }
}
