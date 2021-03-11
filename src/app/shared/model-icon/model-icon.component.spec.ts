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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@mdm/modules/testing/testing.module';
import { ModelListItem } from '@mdm/services/dashboard/dashboard.model';
import { DomainType } from '@mdm/services/mdm-resources/mdm-resources.model';

import { ModelIconComponent } from './model-icon.component';

describe('ModelIconComponent', () => {
  let component: ModelIconComponent;
  let fixture: ComponentFixture<ModelIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      declarations: [ ModelIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelIconComponent);
    component = fixture.componentInstance;
    component.model = new ModelListItem({ 
      id: '1', 
      domainType: DomainType.CodeSet, 
      label: 'test', 
      authority: { 
        id: '2',
        label: 'test',
        url: 'url'
      } 
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
