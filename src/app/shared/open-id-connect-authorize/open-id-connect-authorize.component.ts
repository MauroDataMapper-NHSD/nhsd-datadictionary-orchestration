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
import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@mdm/core/security/security.service';
import { BroadcastService } from '@mdm/core/broadcast/broadcast.service';
import {
  CommonUiStates,
  StateHandlerService
} from '@mdm/core/state-handler/state-handler.service';
import { ToastrService } from 'ngx-toastr';
import { MdmResourcesService } from '@mdm/mdm-resources/mdm-resources/mdm-resources.service';
import { SignInError, SignInErrorType, UserDetails } from '@mdm/core/security/security.model';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'mdm-open-id-connect-authorize',
  templateUrl: './open-id-connect-authorize.component.html',
  styleUrls: ['./open-id-connect-authorize.component.scss']
})
export class OpenIdConnectAuthorizeComponent implements OnInit {
  authorizing = true;
  errorMessage = '';

  constructor(
    private security: SecurityService,
    private broadcast: BroadcastService,
    private stateHandler: StateHandlerService,
    private resourcesService: MdmResourcesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.verifyLoggedIn()) {
      return;
    }

    let query = window.location.search;
    if (!query || query.length === 0) {
      query = window.location.hash.slice(window.location.hash.indexOf('?'));
    }

    const params = new URLSearchParams(query);
    const state = params.get('state');
    const sessionState = params.get('session_state');
    const code = params.get('code');

    if (!state || !sessionState || !code) {
      this.resourcesService.catalogueUser.get('currentUser').pipe(
        catchError(() => {
          this.authorizing = false;
          this.errorMessage = 'OpenID Connect session state has not been provided, and can\'t authenticate current user.';
          return EMPTY;
        })
      ).subscribe((result: { body: UserDetails }) => {
        this.security.addUserToLocalStorage(result.body);
        this.verifyLoggedIn();
        }
      );
    } else {
      this.security
        .authorizeOpenIdConnectSession({
          state,
          sessionState,
          code
        })
        .pipe(
          catchError((error: SignInError) => {
            switch (error.type) {
              case SignInErrorType.InvalidCredentials:
                this.errorMessage = 'Invalid username or password!';
                break;
              case SignInErrorType.AlreadySignedIn:
                this.errorMessage = 'A user is already signed in, please sign out first.';
                break;
              default:
                this.errorMessage = 'Unable to sign in. Please try again later.';
                break;
            }
            return EMPTY;
          }),
          finalize(() => this.authorizing = false)
        )
        .subscribe(() => {
          this.verifyLoggedIn();
        });
    }

/*
    const providerId = localStorage.getItem('openIdConnectProviderId');
    if (!providerId) {
      throw new Error('Cannot retrieve OpenID Connect provider identifier.');
    }

    this.security
      .authorizeOpenIdConnectSession({
        providerId,
        state,
        sessionState,
        code
      })
      .pipe(
        catchError((error: SignInError) => {
          switch (error.type) {
            case SignInErrorType.InvalidCredentials:
              this.errorMessage = 'Invalid username or password!';
              break;
            case SignInErrorType.AlreadySignedIn:
              this.errorMessage = 'A user is already signed in, please sign out first.';
              break;
            default:
              this.errorMessage = 'Unable to sign in. Please try again later.';
              break;
          }

          return EMPTY;
        }),
        finalize(() => (this.authorizing = false)),
        switchMap((user) => {
          if (user) {
            return of(user);
          }

          this.toastr.error('Please sign in using an Mauro account.');
          return this.security.signOut().pipe(
            switchMap(() => {
              this.stateHandler.goTo(
                CommonUiStates.Default,
                {},
                { reload: true, inherit: false }
              );
              return EMPTY;
            })
          );
        })
      )
      .subscribe((user) => {
        this.broadcast.dispatch(BroadcastEvent.SignedIn, user);
        this.toastr.clear();
        this.stateHandler.goTo(
          CommonUiStates.Branches,
          {},
          { reload: true, inherit: false }
        );
      });
 */
  }

  private verifyLoggedIn(): boolean {
    if (this.security.isSignedIn()) {
      // this.messages.loggedInChanged(true);
      // this.broadcast.dispatch(BroadcastEvent.SignedIn, user);
      this.toastr.clear();
      this.stateHandler.goTo(
        CommonUiStates.Branches,
        {},
        { reload: true, inherit: false }
      );
      return true;
    }
    return false;
  }
}
