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

import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@mdm/testing/testing.module';
import { UserDetails } from '@mdm/core/security/security.model';

import { NavbarComponent } from './navbar.component';
import { ComponentHarness, setupTestModuleForComponent } from '@mdm/testing/testing.helpers';
import { MockComponent } from 'ng-mocks';

@Component({selector: 'mdm-user', template: ''})
class UserStubComponent {
  @Input() user!: UserDetails;
}

describe('NavbarComponent', () => {
  let harness: ComponentHarness<NavbarComponent>;

  beforeEach(async () => {
    harness = await setupTestModuleForComponent(
      NavbarComponent,
      {
        declarations: [
          MockComponent(UserStubComponent)
        ]
      });
  });

  it('should create', () => {
    expect(harness?.isComponentCreated).toBeTruthy();
  });
});
