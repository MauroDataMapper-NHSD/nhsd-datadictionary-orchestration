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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIRouterModule } from '@uirouter/angular';
import { ToastrModule } from 'ngx-toastr';
import { UserIdleModule } from 'angular-user-idle';
import { MdmResourcesModule } from '@mdm/mdm-resources/mdm-resources.module';
import { environment } from '@env/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestProgressInterceptor } from './interceptors/http-request-progress.interceptor';
import { states } from '@mdm/routing/ui-states';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    UIRouterModule.forRoot({
      states: states,
      useHash: true,
      otherwise: '/not-found'
    }),
    ToastrModule.forRoot({
      timeOut: 30000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false
    }),
    UserIdleModule.forRoot({ 
      idle: 600, 
      timeout: 300 
    }),
    MdmResourcesModule.forRoot({
      defaultHttpRequestOptions: { withCredentials: true },
      apiEndpoint: environment.apiEndpoint
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestProgressInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
