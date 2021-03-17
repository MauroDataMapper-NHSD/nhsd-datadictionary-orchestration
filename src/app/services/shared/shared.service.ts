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
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BroadcastEvent } from '../broadcast/broadcast.model';
import { BroadcastService } from '../broadcast/broadcast.service';
import { DataDictionaryModel } from '../dashboard/dashboard.model';
import { SecurityService } from '../security/security.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService implements OnDestroy {

  appVersion = environment.version;
  backendUrl = environment.apiEndpoint;
  appTitle = environment.appTitle;
  checkSessionExpiryTimeout = environment.checkSessionExpiryTimeout;
  
  /**
   * Gets the last `HttpErrorResponse` that was captured.
   */
  lastHttpError?: HttpErrorResponse;
  
  private _currentModel?: DataDictionaryModel;

  /**
   * Gets the currently selected model.
   */
  get currentModel() {
    return this._currentModel;
  }

  /**
   * Signal to attach to subscriptions to trigger when they should be unsubscribed.
   */
  private unsubscribe$ = new Subject();

  constructor(
    private security: SecurityService,
    private broadcast: BroadcastService,
    private toastr: ToastrService) { 
    this.broadcast
      .on<DataDictionaryModel>(BroadcastEvent.ModelChanged)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(model => this._currentModel = model);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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
