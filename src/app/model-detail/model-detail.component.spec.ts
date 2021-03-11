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
import { TestingModule } from '@mdm/modules/testing/testing.module';
import { ModelListItem } from '@mdm/services/dashboard/dashboard.model';

import { ModelDetailComponent } from './model-detail.component';

@Component({selector: 'mdm-model-icon', template: ''})
class ModelIconStubComponent { 
  @Input() model!: ModelListItem;
}

@Component({selector: 'mdm-model-actions', template: ''})
class ModelActionsStubComponent { 
  @Input() model!: ModelListItem;
}

describe('ModelDetailComponent', () => {
  let component: ModelDetailComponent;
  let fixture: ComponentFixture<ModelDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      declarations: [ 
        ModelDetailComponent,
        ModelIconStubComponent,
        ModelActionsStubComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
