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
import { RawParams, TransitionOptions, UIRouter } from '@uirouter/angular';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class StateHandlerService {

  constructor(
    private router: UIRouter,
    private ngToast: ToastrService) { }

  go(name: string, params?: RawParams, options?: TransitionOptions) {
    return this.router.stateService.go(name, params, options);
  }

  applicationOffline() {
    this.ngToast.warning('Application is offline!');
  }

  connectionError() {
    this.ngToast.warning('Server connection failed');
  }

  serverError(options?: TransitionOptions) {
    return this.router.stateService.go('app.container.serverError', {}, options);
  }

  notImplemented(options?: TransitionOptions) {
    return this.router.stateService.go('app.container.notImplemented', {}, options);
  }

  notAuthorized(options?: TransitionOptions) {
    return this.router.stateService.go('app.container.notAuthorized', {}, options);
  }

  notFound(options?: TransitionOptions) {
    return this.router.stateService.go('app.container.notFound', {}, options);
  }
}
