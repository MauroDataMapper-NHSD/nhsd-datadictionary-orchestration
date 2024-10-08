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
import { BranchContainerComponent } from './branch-container/branch-container.component';
import { SharedModule } from '@mdm/shared/shared.module';
import { BranchDefaultComponent } from './branch-default/branch-default.component';
import { BranchDetailComponent } from './branch-detail/branch-detail.component';
import { BranchStatisticsComponent } from './branch-statistics/branch-statistics.component';
import { BranchIntegrityComponent } from './branch-integrity/branch-integrity.component';
import { BranchIntegrityTableComponent } from './branch-integrity-table/branch-integrity-table.component';
import { BranchPublishComponent } from './branch-publish/branch-publish.component';

@NgModule({
  declarations: [
    BranchContainerComponent,
    BranchDefaultComponent,
    BranchDetailComponent,
    BranchStatisticsComponent,
    BranchIntegrityComponent,
    BranchIntegrityTableComponent,
    BranchPublishComponent
  ],
  imports: [SharedModule]
})
export class BranchesModule {}
