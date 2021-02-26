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
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BroadcastEvent } from '@mdm/services/broadcast/broadcast.model';
import { BroadcastService } from '@mdm/services/broadcast/broadcast.service';
import { SecurityHandlerService } from '@mdm/services/handlers/security-handler.service';
import { ValidatorService } from '@mdm/services/validator.service';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'mdm-sign-in-modal',
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.scss']
})
export class SignInModalComponent implements OnInit {

  message = '';
  authenticating = false;

  signInForm!: FormGroup;

  get userName() {
    return this.signInForm.get('userName');
  }

  get password() {
    return this.signInForm.get('password');
  }

  constructor(
    private dialogRef: MatDialogRef<SignInModalComponent>,
    private validator: ValidatorService,
    private securityHandler: SecurityHandlerService,
    private broadcast: BroadcastService) { }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      userName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validator.emailPattern)
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }  

  close() {
    this.dialogRef.close();
  }

  forgotPassword() {

  }

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
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.message = 'Invalid username or password!';
          }
          else if (error.status === 409) {
            this.message = 'A user is already signed in, please sign out first.';
          }
          else if (error.status === -1) {
            this.message = 'Unable to sign in. Please try again later.';
          }
          return [];
        }),
        finalize(() => {
          this.authenticating = false;
          this.signInForm.enable();
        })
      )
      .subscribe(user => {
        this.broadcast.dispatch(BroadcastEvent.UserSignedIn, user);
        this.dialogRef.close(user);
      });
  }
}
