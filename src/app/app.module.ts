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
import { SharedService } from './services/shared.service';
import { BroadcastService } from './services/broadcast/broadcast.service';
import { ToastrService } from 'ngx-toastr';
import { BroadcastEvent } from './services/broadcast/broadcast.model';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { StateHandlerService } from './services/handlers/state-handler.service';
import { ModalModule } from './modules/modal/modal.module';
import { MdmResourcesModule } from './modules/mdm-resources/mdm-resources.module';
import { environment } from '@env/environment';

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
  bootstrap: [UiViewComponent]
})
export class AppModule {
  constructor(
    private shared: SharedService,
    private broadcast: BroadcastService,
    private stateHandler: StateHandlerService,
    private toastr: ToastrService
  ) {
    this.broadcast
      .on(BroadcastEvent.ApplicationOffline)
      .subscribe(() => this.toastr.warning('Application is offline!'));

    this.subscribeHttpErrorEvent(BroadcastEvent.NotAuthorized, 'app.container.notAuthorized');
    this.subscribeHttpErrorEvent(BroadcastEvent.NotFound, 'app.container.notFound');
    this.subscribeHttpErrorEvent(BroadcastEvent.NotImplemented, 'app.container.notImplemented');
    this.subscribeHttpErrorEvent(BroadcastEvent.ServerError, 'app.container.serverError');    
  }

  private subscribeHttpErrorEvent(event: BroadcastEvent, state: string) {
    this.broadcast
      .on<HttpErrorResponse>(event)
      .subscribe(response => this.handleHttpError(response, state));
  }

  private handleHttpError(response: HttpErrorResponse, state: string) {
    this.shared.lastHttpError = response;
    this.stateHandler.go(state);
  }
}
