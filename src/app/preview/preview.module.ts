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
import { SharedModule } from '@mdm/shared/shared.module';
import { PreviewContainerComponent } from './preview-container/preview-container.component';
import { PreviewDefaultComponent } from './preview-default/preview-default.component';
import { PreviewIndexComponent } from './preview-index/preview-index.component';
import { PreviewHomeComponent } from './preview-home/preview-home.component';
import { PreviewTileComponent } from './preview-tile/preview-tile.component';
import { PreviewDetailComponent } from './preview-detail/preview-detail.component';
import { PreviewTocComponent } from './preview-toc/preview-toc.component';
import { PreviewExpandablePanelComponent } from './preview-expandable-panel/preview-expandable-panel.component';
import { PreviewBreadcrumbComponent } from './preview-breadcrumb/preview-breadcrumb.component';

@NgModule({
  declarations: [
    PreviewContainerComponent,
    PreviewDefaultComponent,
    PreviewIndexComponent,
    PreviewHomeComponent,
    PreviewTileComponent,
    PreviewDetailComponent,
    PreviewTocComponent,
    PreviewExpandablePanelComponent,
    PreviewBreadcrumbComponent
  ],
  imports: [
    SharedModule
  ]
})
export class PreviewModule { }
