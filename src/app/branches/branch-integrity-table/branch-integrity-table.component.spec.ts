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

import { DomainIconComponent } from '@mdm/shared/domain-icon/domain-icon.component';
import { ComponentHarness, setupTestModuleForComponent } from '@mdm/testing/testing.helpers';
import { MockComponent } from 'ng-mocks';

import { BranchIntegrityTableComponent } from './branch-integrity-table.component';

describe('BranchIntegrityTableComponent', () => {
  let harness: ComponentHarness<BranchIntegrityTableComponent>;

  beforeEach(async () => {
    harness = await setupTestModuleForComponent(
      BranchIntegrityTableComponent,
      {
        declarations: [
          MockComponent(DomainIconComponent)
        ]
      });
  });

  it('should create', () => {
    expect(harness?.isComponentCreated).toBeTruthy();
  });
});
