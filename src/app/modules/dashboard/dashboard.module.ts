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
import { HomeComponent } from '@mdm/home/home.component';
import { AboutComponent } from '@mdm/about/about.component';
import { UIRouterModule } from '@uirouter/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorComponent } from '@mdm/error/error.component';
import { NotImplementedComponent } from '@mdm/error/not-implemented/not-implemented.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NotAuthorizedComponent } from '@mdm/error/not-authorized/not-authorized.component';
import { NotFoundComponent } from '@mdm/error/not-found/not-found.component';
import { ServerErrorComponent } from '@mdm/error/server-error/server-error.component';
import { ModelsComponent } from '@mdm/models/models.component';
import { ModelDetailComponent } from '../../model-detail/model-detail.component';
import { ModelActionsComponent } from '../../model-actions/model-actions.component';
import { StatisticsTableComponent } from '../../shared/statistics-table/statistics-table.component';
import { SharedModule } from '@mdm/shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ErrorComponent,
    NotImplementedComponent,
    NotAuthorizedComponent,
    NotFoundComponent,
    ServerErrorComponent,
    ModelsComponent,
    ModelDetailComponent,
    ModelActionsComponent,
    StatisticsTableComponent
  ],
  imports: [
    UIRouterModule,
    NgxJsonViewerModule,
    FlexLayoutModule,    
    SharedModule
  ],
  exports: [
    HomeComponent,
    AboutComponent,
    ErrorComponent,
    NotImplementedComponent,
    NotAuthorizedComponent
  ]
})
export class DashboardModule { }
