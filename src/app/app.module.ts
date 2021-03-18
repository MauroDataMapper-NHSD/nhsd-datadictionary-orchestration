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

import { AppComponent } from './app.component';
import { UiViewComponent } from './ui-view/ui-view.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { UIRouterModule } from '@uirouter/angular';
import { states } from './routing/ui-states';
import { LayoutModule } from './layout/layout.module';
import { ErrorModule } from './error/error.module';
import { AppContainerComponent } from './app-container/app-container.component';
import { PagesModule } from './pages/pages.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { BranchesModule } from './branches/branches.module';

@NgModule({
  declarations: [
    AppComponent,
    AppContainerComponent,
    UiViewComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    UIRouterModule.forRoot({
      states: states,
      useHash: true,
      otherwise: '/not-found',
    }),
    LayoutModule,
    ErrorModule,
    PagesModule,
    DialogsModule,    
    BranchesModule
  ],
  bootstrap: [UiViewComponent]
})
export class AppModule {  }
