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
import { DataDictionaryModel } from '@mdm/core/dashboard/dashboard.model';
import { DashboardService } from '@mdm/core/dashboard/dashboard.service';
import { of } from 'rxjs';

import { ModelListComponent } from './model-list.component';

@Component({selector: 'mdm-model-icon', template: ''})
class ModelIconStubComponent { 
  @Input() model!: DataDictionaryModel;
}

interface DashboardServiceStub {
  getModels: jest.Mock;
}

describe('ModelsListComponent', () => {
  let component: ModelListComponent;
  let fixture: ComponentFixture<ModelListComponent>;

  const dashboardStub: DashboardServiceStub = {
    getModels: jest.fn()
  }

  beforeEach(() => {
    dashboardStub.getModels.mockImplementationOnce(() => of());
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        {
          provide: DashboardService,
          useValue: dashboardStub          
        }
      ],
      declarations: [ 
        ModelListComponent,
        ModelIconStubComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
