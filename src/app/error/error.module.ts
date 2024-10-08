/*
Copyright 2021-2024 NHS England

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
*/

import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotImplementedComponent } from './not-implemented/not-implemented.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { SharedModule } from '@mdm/shared/shared.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  declarations: [
    ErrorComponent,
    NotImplementedComponent,
    NotAuthorizedComponent,
    NotFoundComponent,
    ServerErrorComponent
  ],
  imports: [SharedModule, NgxJsonViewerModule],
  exports: [
    ErrorComponent,
    NotImplementedComponent,
    NotAuthorizedComponent,
    NotFoundComponent,
    ServerErrorComponent
  ]
})
export class ErrorModule {}
