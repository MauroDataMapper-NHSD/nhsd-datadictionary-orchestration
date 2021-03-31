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

import { AlertComponent } from '@mdm/shared/alert/alert.component';
import { ComponentHarness, setupTestModuleForComponent } from '@mdm/testing/testing.helpers';
import { MockComponent } from 'ng-mocks';
import { PreviewBreadcrumbComponent } from '../preview-breadcrumb/preview-breadcrumb.component';
import { PreviewExpandablePanelComponent } from '../preview-expandable-panel/preview-expandable-panel.component';
import { PreviewTocComponent } from '../preview-toc/preview-toc.component';

import { PreviewDetailComponent } from './preview-detail.component';

describe('PreviewDetailComponent', () => {
  let harness: ComponentHarness<PreviewDetailComponent>;

  beforeEach(async () => {
    harness = await setupTestModuleForComponent(
      PreviewDetailComponent,
      {
        declarations: [
          MockComponent(PreviewTocComponent),
          MockComponent(PreviewExpandablePanelComponent),
          MockComponent(PreviewBreadcrumbComponent),
          MockComponent(AlertComponent)
        ]
      });
  });

  it('should create', () => {
    expect(harness?.isComponentCreated).toBeTruthy();
  });
});
