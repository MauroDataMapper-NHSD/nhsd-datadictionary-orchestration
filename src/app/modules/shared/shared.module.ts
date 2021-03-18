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
import { ModelListComponent } from '@mdm/shared/model-list/model-list.component';
import { ModelIconComponent } from '@mdm/shared/model-icon/model-icon.component';
import { LoadingIndicatorComponent } from '@mdm/shared/loading-indicator/loading-indicator.component';
import { ModelSelectorComponent } from '@mdm/shared/model-selector/model-selector.component';
import { ModelItemBannerComponent } from '../../shared/model-item-banner/model-item-banner.component';
import { MaterialModule } from '@mdm/material/material.module';



@NgModule({
  declarations: [
    ModelListComponent,
    ModelIconComponent,
    LoadingIndicatorComponent,
    ModelSelectorComponent,
    ModelItemBannerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ModelListComponent,
    ModelIconComponent,
    LoadingIndicatorComponent,
    ModelSelectorComponent
  ]
})
export class SharedModule { }
