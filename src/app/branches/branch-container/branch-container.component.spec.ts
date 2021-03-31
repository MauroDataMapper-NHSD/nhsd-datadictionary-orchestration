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

import { ComponentHarness, setupTestModuleForComponent } from '@mdm/testing/testing.helpers';
import { BranchSelectorComponent } from '@mdm/shared/branch-selector/branch-selector.component';
import { BranchContainerComponent } from './branch-container.component';
import { MockComponent, MockService } from 'ng-mocks';
import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import { of } from 'rxjs';

describe('BranchesContainerComponent', () => {
  let harness: ComponentHarness<BranchContainerComponent>;

  beforeEach(async () => {
    harness = await setupTestModuleForComponent(
      BranchContainerComponent,
      {
        declarations: [
          MockComponent(BranchSelectorComponent)
        ],
        providers: [
          {
            provide: DataDictionaryService,
            useValue: MockService(DataDictionaryService, {
              getAvailableBranches: jest.fn(() => of([]))
            })
          }
        ]
      });
  });

  it('should create', () => {
    expect(harness?.isComponentCreated).toBeTruthy();
  });
});
