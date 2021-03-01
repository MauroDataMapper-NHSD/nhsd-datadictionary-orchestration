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

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { BroadcastEvent } from '../broadcast/broadcast.model';
import { BroadcastService } from '../broadcast/broadcast.service';
import { SecurityService } from '../security/security.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  backendUrl = environment.apiEndpoint;
  appTitle = environment.appTitle;
  checkSessionExpiryTimeout = environment.checkSessionExpiryTimeout;
  
  lastHttpError?: HttpErrorResponse;

  constructor(
    private security: SecurityService,
    private broadcast: BroadcastService,
    private toastr: ToastrService) { }

  checkSessionExpiry() {
    this.security
      .isCurrentSessionExpired()
      .pipe(filter(authenticated => !authenticated))
      .subscribe(() => {
        this.toastr.error('Your session has expired! Please sign in.');
        this.broadcast.dispatch(BroadcastEvent.RequestSignOut);
      })
  }
}
