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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { states } from './routing/ui-states';
import { UIRouterModule } from '@uirouter/angular';
import { AppContainerComponent } from './app-container/app-container.component';
import { UiViewComponent } from './shared/ui-view/ui-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from './modules/modal/modal.module';
import { MdmResourcesModule } from './modules/mdm-resources/mdm-resources.module';
import { environment } from '@env/environment';
import { HttpRequestProgressInterceptor } from './interceptors/http-request-progress.interceptor';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    AppContainerComponent,
    UiViewComponent
  ],
  imports: [
    BrowserModule,
    DashboardModule,
    ModalModule,
    HttpClientModule,
    MdmResourcesModule.forRoot({
      defaultHttpRequestOptions: { withCredentials: true },
      apiEndpoint: environment.apiEndpoint
    }),
    UIRouterModule.forRoot({
      states: states,
      useHash: true,
      otherwise: '/not-found'
    }),
    BrowserAnimationsModule
  ],
  providers: [
    { 
      provide: MAT_DIALOG_DEFAULT_OPTIONS, 
      useValue: {
        hasBackdrop: true, 
        autoFocus: false
      } 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestProgressInterceptor,
      multi: true
    }
  ],
  bootstrap: [UiViewComponent]
})
export class AppModule {  }
