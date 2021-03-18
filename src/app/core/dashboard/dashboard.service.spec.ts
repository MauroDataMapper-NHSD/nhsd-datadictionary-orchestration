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

import { TestBed } from '@angular/core/testing';
import { TestingModule } from '@mdm/testing/testing.module';
import { cold } from 'jest-marbles';
import { CodeSet } from '../../mdm-resources/mdm-resources/adapters/code-sets.model';
import { CodeSetsService } from '../../mdm-resources/mdm-resources/adapters/code-sets.service';
import { DataModel, DataModelType } from '../../mdm-resources/mdm-resources/adapters/data-models.model';
import { DataModelsService } from '../../mdm-resources/mdm-resources/adapters/data-models.service';
import { Terminology } from '../../mdm-resources/mdm-resources/adapters/terminology.model';
import { TerminologyService } from '../../mdm-resources/mdm-resources/adapters/terminology.service';
import { Authority, DomainType } from '../../mdm-resources/mdm-resources/mdm-resources.model';
import { DataDictionaryModel } from './dashboard.model';

import { DashboardService } from './dashboard.service';

interface DataModelsServiceStub {
  list: jest.Mock;
  get: jest.Mock;
}

interface CodeSetsServiceStub {
  list: jest.Mock;
  get: jest.Mock;
}

interface TerminologyServiceStub {
  list: jest.Mock;
  get: jest.Mock;
}

describe('DashboardService', () => {
  let service: DashboardService;

  const authority: Authority = {
    id: '123',
    label: 'authority',
    url: 'http://localhost'
  };

  const dataModel: DataModel =
  {
    id: '1',
    domainType: DomainType.DataModel,
    label: 'data model',
    authority: authority,
    type: DataModelType.DataStandard
  };

  const codeSet: CodeSet =
  {
    id: '2',
    domainType: DomainType.CodeSet,
    label: 'code set',
    authority: authority
  };

  const terminology: Terminology =
  {
    id: '3',
    domainType: DomainType.Terminology,
    label: 'terminology',
    authority: authority
  };

  const dataModelsStub: DataModelsServiceStub = {
    list: jest.fn(),
    get: jest.fn()
  };

  const codeSetsStub: CodeSetsServiceStub = {
    list: jest.fn(),
    get: jest.fn()
  };

  const terminologyStub: TerminologyServiceStub = {
    list: jest.fn(),
    get: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        {
          provide: DataModelsService,
          useValue: dataModelsStub
        },
        {
          provide: CodeSetsService,
          useValue: codeSetsStub
        },
        {
          provide: TerminologyService,
          useValue: terminologyStub
        }
      ]
    });
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the model list', () => {
    dataModelsStub.list.mockImplementationOnce(() => cold('--a', { a: [dataModel] }));
    codeSetsStub.list.mockImplementationOnce(() => cold('---a', { a: [codeSet] }));
    terminologyStub.list.mockImplementationOnce(() => cold('-a', { a: [terminology] }));

    const expected$ = cold('---a', {
      a: [
        new DataDictionaryModel(dataModel),
        new DataDictionaryModel(codeSet),
        new DataDictionaryModel(terminology)
      ]
    });

    const actual$ = service.getModels();
    expect(actual$).toBeObservable(expected$);
  })

  it('should return DataModel', () => {
    dataModelsStub.get.mockImplementationOnce(() => cold('--a', { a: dataModel }));
    const expected$ = cold('--a', { a: dataModel });
    const actual$ = service.getModelDetail(dataModel.domainType, dataModel.id);
    expect(actual$).toBeObservable(expected$);
  })

  it('should return CodeSet', () => {
    codeSetsStub.get.mockImplementationOnce(() => cold('--a', { a: codeSet }));
    const expected$ = cold('--a', { a: codeSet });
    const actual$ = service.getModelDetail(codeSet.domainType, codeSet.id);
    expect(actual$).toBeObservable(expected$);
  })

  it('should return Terminology', () => {
    terminologyStub.get.mockImplementationOnce(() => cold('--a', { a: terminology }));
    const expected$ = cold('--a', { a: terminology });
    const actual$ = service.getModelDetail(terminology.domainType, terminology.id);
    expect(actual$).toBeObservable(expected$);
  })

  it('should return undefined for unknown domain type', () => {
    const expected$ = cold('(a|)', { a: undefined });
    const actual$ = service.getModelDetail(-1 as unknown as DomainType, '1');
    expect(actual$).toBeObservable(expected$);
  })
});
