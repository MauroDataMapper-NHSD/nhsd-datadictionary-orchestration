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
import { ApiProperty } from '@maurodatamapper/mdm-resources';
import { of } from 'rxjs';
import { FeaturesService } from './features.service';
import { setupTestModuleForService } from '@mdm/testing/testing.helpers';
import { MdmResourcesService } from '@mdm/mdm-resources/mdm-resources/mdm-resources.service';

describe('FeaturesService', () => {
  let service: FeaturesService;
  const endpointsStub = {
    apiProperties: {
      listPublic: jest.fn()
    }
  };

  beforeEach(() => {
    // Default endpoint call
    endpointsStub.apiProperties.listPublic.mockImplementationOnce(() => of([]));

    service = setupTestModuleForService(FeaturesService, {
      providers: [
        {
          provide: MdmResourcesService,
          useValue: endpointsStub
        }
      ]
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each([
    ['feature.use_open_id_connect', true, (s: FeaturesService) => s.useOpenIdConnect]
  ])('should set feature toggle according to api property', (name, state, accessor) => {
    const apiProperty: ApiProperty = {
      key: name,
      value: JSON.stringify(state),
      category: 'Features'
    };

    endpointsStub.apiProperties.listPublic.mockClear();
    endpointsStub.apiProperties.listPublic.mockImplementationOnce(() =>
      of({
        count: 1,
        items: [apiProperty]
      })
    );

    service.loadFromServer();
    expect(accessor(service)).toBe(state);
  });
});
