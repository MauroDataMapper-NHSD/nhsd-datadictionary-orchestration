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

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMdmRestHandler, IMdmRestHandlerOptions } from '@maurodatamapper/mdm-resources';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BroadcastEvent } from '../broadcast/broadcast.model';
import { BroadcastService } from '../broadcast/broadcast.service';

@Injectable({
  providedIn: 'root'
})
export class MdmRestHandlerService implements IMdmRestHandler {

  constructor(
    private http: HttpClient,
    private broadcast: BroadcastService) { }

  process(url: string, options: IMdmRestHandlerOptions) {
    if (options.withCredentials === undefined ||
      options.withCredentials === null ||
      (options.withCredentials !== undefined && options.withCredentials === false)) {
      throw new Error('withCredentials is not provided!');
    }

    if (options.responseType) { } else {
      options.responseType = undefined;
    }

    options.headers = options.headers || {};
    // STOP IE11 from Caching HTTP GET
    options.headers['Cache-Control'] = 'no-cache';
    options.headers.Pragma = 'no-cache';    

    return this.http
      .request(
        options.method, 
        url, 
        {
          body: options.body,
          headers: options.headers,
          withCredentials: options.withCredentials,
          observe: 'response',
          responseType: options.responseType
        }
      )
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 0 || response.status === -1) {
            this.broadcast.dispatch(BroadcastEvent.ApplicationOffline, response);
          } 
          else if (response.status === 401 && !options.login) {
            this.broadcast.dispatch(BroadcastEvent.NotAuthorized, response);
          } 
          else if (response.status === 404) {
            this.broadcast.dispatch(BroadcastEvent.NotFound, response);
          } 
          else if (response.status === 501) {
            this.broadcast.dispatch(BroadcastEvent.NotImplemented, response);
          } 
          else if (response.status >= 400 && response.status < 500 && options.method === 'GET') {
            this.broadcast.dispatch(BroadcastEvent.NotFound, response);
          } 
          else if (response.status >= 500) {
            this.broadcast.dispatch(BroadcastEvent.ServerError, response);
          }
          return throwError(response);
        })
      );
  }
}
