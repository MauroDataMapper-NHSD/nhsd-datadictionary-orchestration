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

import { Injectable } from '@angular/core';
import { AdministrationSessionResponse, SignInParameters, SignInResponse, UserDetails } from '@mdm/services/security/security.model';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MdmResourcesService } from '../mdm-resources/mdm-resources.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityHandlerService {

  constructor(private resources: MdmResourcesService) { }

  signIn(parameters: SignInParameters): Observable<UserDetails> {
    // This parameter is very important as we do not want to handle 401 if user credential is rejected on login modal form
    // as if the user credentials are rejected Back end server will return 401, we should not show the login modal form again
    return this.resources.security
      .login(parameters, { login: true })
      .pipe(
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

  private addUserToLocalStorage(user: UserDetails) {
    // Keep username for 100 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    localStorage.setItem('userId', user.id);
    localStorage.setItem('token', user.token ?? '');
    localStorage.setItem('email', JSON.stringify({ email: user.userName, expiry: expiryDate }));
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    localStorage.setItem('isAdmin', (user.isAdmin ?? false).toString());
    localStorage.setItem('role', user.role ?? '');
    localStorage.setItem('needsToResetPassword', (user.needsToResetPassword ?? false).toString());
  }

}
