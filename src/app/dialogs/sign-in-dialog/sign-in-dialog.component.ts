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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PublicOpenIdConnectProvider } from '@maurodatamapper/mdm-resources';
import { FeaturesService } from '@mdm/core/features/features.service';
import {
  SignInError,
  SignInErrorType,
  UserDetails
} from '@mdm/core/security/security.model';
import { SecurityService } from '@mdm/core/security/security.service';
import { ValidatorService } from '@mdm/core/validator/validator.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

@Component({
  selector: 'mdm-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInModalComponent implements OnInit {
  message = '';
  authenticating = false;
  openIdConnectProviders?: PublicOpenIdConnectProvider[];

  signInForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required, // eslint-disable-line @typescript-eslint/unbound-method
      Validators.pattern(this.validator.emailPattern)
    ]),
    password: new FormControl('', [
      Validators.required // eslint-disable-line @typescript-eslint/unbound-method
    ])
  });

  constructor(
    private dialogRef: MatDialogRef<SignInModalComponent, UserDetails>,
    private validator: ValidatorService,
    private securityHandler: SecurityService,
    private features: FeaturesService,
    private toastr: ToastrService
  ) {}

  get userName() {
    return this.signInForm.controls.userName;
  }

  get password() {
    return this.signInForm.controls.password;
  }

  ngOnInit(): void {
    this.loadOpenIdConnectProviders();
  }

  close() {
    this.dialogRef.close();
  }

  forgotPassword() {}

  signIn() {
    this.message = '';

    if (this.signInForm.invalid) {
      return;
    }

    this.authenticating = true;
    this.signInForm.disable();

    this.securityHandler
      .signIn({
        username: this.userName.value ?? '',
        password: this.password.value ?? ''
      })
      .pipe(
        catchError((error: SignInError) => {
          switch (error.type) {
            case SignInErrorType.InvalidCredentials:
              this.message = 'Invalid username or password!';
              break;
            case SignInErrorType.AlreadySignedIn:
              this.message = 'A user is already signed in, please sign out first.';
              break;
            default:
              this.message = 'Unable to sign in. Please try again later.';
              break;
          }

          return EMPTY;
        }),
        finalize(() => {
          this.authenticating = false;
          this.signInForm.enable();
        }),
        switchMap((user) => {
          if (user.isAdmin) {
            return of(user);
          }

          this.message =
            'This application is only available to administrators. Please sign in using an administrator account.';
          return this.securityHandler.signOut().pipe(switchMap(() => EMPTY));
        })
      )
      .subscribe((user) => this.dialogRef.close(user));
  }

  authenticateWithOpenIdConnect(provider: PublicOpenIdConnectProvider) {
    if (!provider.authorizationEndpoint) {
      this.toastr.error(
        `Unable to authenticate with ${provider.label} because of a missing endpoint. Please contact your administrator for further support.`
      );
      return;
    }

    // Track which provider was used, will be needed once redirected back to Mauro
    localStorage.setItem('openIdConnectProviderId', provider.id);
    const redirectUrl = this.securityHandler.getOpenIdConnectAuthorizationUrl(provider);
    window.open(redirectUrl.toString(), '_self');
  }

  private loadOpenIdConnectProviders() {
    if (!this.features.useOpenIdConnect) {
      return;
    }

    this.securityHandler
      .getOpenIdConnectProviders()
      .subscribe((providers) => (this.openIdConnectProviders = providers));
  }
}
