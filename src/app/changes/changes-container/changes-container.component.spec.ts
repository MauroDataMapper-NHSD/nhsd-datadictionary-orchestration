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

import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import { PreviewContainerComponent } from '@mdm/preview/preview-container/preview-container.component';
import { AlertComponent } from '@mdm/shared/alert/alert.component';
import { BranchSelectorComponent } from '@mdm/shared/branch-selector/branch-selector.component';
import {
  ComponentHarness,
  setupTestModuleForComponent
} from '@mdm/testing/testing.helpers';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

describe('PreviewContainerComponent', () => {
  let harness: ComponentHarness<PreviewContainerComponent>;

  beforeEach(async () => {
    harness = await setupTestModuleForComponent(PreviewContainerComponent, {
      declarations: [
        MockComponent(AlertComponent),
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
