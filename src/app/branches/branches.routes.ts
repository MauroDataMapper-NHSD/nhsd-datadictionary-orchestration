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

import { Ng2StateDeclaration } from "@uirouter/angular";
import { BranchContainerComponent } from "./branch-container/branch-container.component";
import { BranchDefaultComponent } from "./branch-default/branch-default.component";
import { BranchDetailComponent } from "./branch-detail/branch-detail.component";

export const states: Ng2StateDeclaration[] = [
  {
    name: 'app.container.branches',
    component: BranchContainerComponent
  },
  {
    name: 'app.container.branches.default',
    url: '/branches',
    component: BranchDefaultComponent
  },
  {
    name: 'app.container.branches.detail',
    url: '/branches/:branch/{tabView:string}',
    component: BranchDetailComponent,
    params: {
      tabView: {
        dynamic: true,
        value: null,
        squash: true
      }
    }
  }
];