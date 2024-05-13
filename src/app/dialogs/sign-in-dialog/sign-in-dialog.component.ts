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
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  SignInError,
  SignInErrorType,
  UserDetails
} from '@mdm/core/security/security.model';
import { SecurityService } from '@mdm/core/security/security.service';
import { ValidatorService } from '@mdm/core/validator/validator.service';
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

  signInForm!: UntypedFormGroup;

  get userName() {
    return this.signInForm.get('userName');
  }

  get password() {
    return this.signInForm.get('password');
  }

  constructor(
    private dialogRef: MatDialogRef<SignInModalComponent, UserDetails>,
    private validator: ValidatorService,
    private securityHandler: SecurityService
  ) {}

  ngOnInit(): void {
    this.signInForm = new UntypedFormGroup({
      userName: new UntypedFormControl('', [
        Validators.required, // eslint-disable-line @typescript-eslint/unbound-method
        Validators.pattern(this.validator.emailPattern)
      ]),
      password: new UntypedFormControl('', [
        Validators.required // eslint-disable-line @typescript-eslint/unbound-method
      ])
    });
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
        username: this.userName?.value,
        password: this.password?.value
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
}
