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

import { Ng2StateDeclaration } from '@uirouter/angular';
import { ChangesContainerComponent } from '@mdm/changes/changes-container/changes-container.component';
import { ChangesHomeComponent } from '@mdm/changes/changes-home/changes-home.component';

export const states: Ng2StateDeclaration[] = [
  {
    name: 'app.container.changes',
    component: ChangesContainerComponent
  },
  {
    name: 'app.container.changes.default',
    url: '/changes',
    component: ChangesHomeComponent
  },
  {
    name: 'app.container.changes.home',
    url: '/changes/:branch',
    component: ChangesHomeComponent
  }
];
