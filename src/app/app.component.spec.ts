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

import { MockComponent } from 'ng-mocks';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { LoadingIndicatorComponent } from './shared/loading-indicator/loading-indicator.component';
import { ComponentHarness, setupTestModuleForComponent } from './testing/testing.helpers';

describe('AppComponent', () => {
  let harness: ComponentHarness<AppComponent>;

  beforeEach(async () => {
    harness = await setupTestModuleForComponent(
      AppComponent,
      {
        declarations: [
          MockComponent(NavbarComponent),
          MockComponent(FooterComponent),
          MockComponent(LoadingIndicatorComponent)
        ]
      });
  });

  it('should create the app', () => {
    expect(harness?.isComponentCreated).toBeTruthy();
  });

  it(`should have as title 'nhsd-datadictionary-orchestration'`, () => {
    expect(harness.component.title).toEqual('nhsd-datadictionary-orchestration');
  });
});
