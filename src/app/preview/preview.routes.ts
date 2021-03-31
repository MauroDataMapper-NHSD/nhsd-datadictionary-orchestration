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

import { Ng2StateDeclaration } from '@uirouter/angular';
import { PreviewContainerComponent } from './preview-container/preview-container.component';
import { PreviewDefaultComponent } from './preview-default/preview-default.component';
import { PreviewDetailComponent } from './preview-detail/preview-detail.component';
import { PreviewHomeComponent } from './preview-home/preview-home.component';
import { PreviewIndexComponent } from './preview-index/preview-index.component';

export const states: Ng2StateDeclaration[] = [
  {
    name: 'app.container.preview',
    component: PreviewContainerComponent
  },
  {
    name: 'app.container.preview.default',
    url: '/preview',
    component: PreviewDefaultComponent
  },
  {
    name: 'app.container.preview.home',
    url: '/preview/:branch',
    component: PreviewHomeComponent
  },
  {
    name: 'app.container.preview.index',
    url: '/preview/:branch/:index',
    component: PreviewIndexComponent
  },
  {
    name: 'app.container.preview.detail',
    url: '/preview/:branch/:index/:id',
    component: PreviewDetailComponent
  }
];