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
import { HomeComponent } from '@mdm/home/home.component';
import { AboutComponent } from '@mdm/about/about.component';
import { NavbarComponent } from '@mdm/layout/navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { UIRouterModule } from '@uirouter/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from '@mdm/layout/footer/footer.component';
import { UserComponent } from '@mdm/shared/user/user.component';
import { ToastrModule } from 'ngx-toastr';
import { ErrorComponent } from '@mdm/error/error.component';
import { NotImplementedComponent } from '@mdm/error/not-implemented/not-implemented.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NotAuthorizedComponent } from '@mdm/error/not-authorized/not-authorized.component';
import { NotFoundComponent } from '@mdm/error/not-found/not-found.component';
import { ServerErrorComponent } from '@mdm/error/server-error/server-error.component';
import { UserIdleModule } from 'angular-user-idle';
import { LoadingIndicatorComponent } from '@mdm/shared/loading-indicator/loading-indicator.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    UserComponent,
    HomeComponent,
    AboutComponent,
    ErrorComponent,
    NotImplementedComponent,
    NotAuthorizedComponent,
    NotFoundComponent,
    ServerErrorComponent,
    LoadingIndicatorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UIRouterModule,
    NgxJsonViewerModule,
    FlexLayoutModule,
    ToastrModule.forRoot({
      timeOut: 30000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false
    }),
    UserIdleModule.forRoot({ 
      idle: 600, 
      timeout: 300 
    })
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    UserComponent,
    HomeComponent,
    AboutComponent,
    ErrorComponent,
    NotImplementedComponent,
    NotAuthorizedComponent,
    LoadingIndicatorComponent
  ]
})
export class DashboardModule { }
