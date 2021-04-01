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

import { SharedService } from '@mdm/core/shared/shared.service';

import { UserComponent } from './user.component';
import { ComponentHarness, setupTestModuleForComponent } from '@mdm/testing/testing.helpers';
import { MockProvider } from 'ng-mocks';

describe('UserComponent', () => {
  let harness: ComponentHarness<UserComponent>;

  const testBackendUrl = 'http://test.com';

  beforeEach(async () => {
    harness = await setupTestModuleForComponent(
      UserComponent,
      {
        providers: [
          MockProvider(SharedService, {
            backendUrl: testBackendUrl
          })
        ]
      });
  });

  it('should create', () => {
    expect(harness?.isComponentCreated).toBeTruthy();
  });

  it.each(['1', '2', '3'])('should set the correct image URL for user %s', (id) => {
    harness.component.user = {
      id,
      firstName: 'test',
      lastName: 'test',
      userName: 'test'
    };

    harness.detectChanges();
    harness.component.ngOnInit();

    const expected = `${testBackendUrl}/catalogueUsers/${id}/image`;
    expect(harness.component.imageUrl).toBe(expected);
  });
});
