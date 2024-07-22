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

import { DomainType } from '@mdm/mdm-resources/mdm-resources/mdm-resources.model';
import { setupTestModuleForService } from '@mdm/testing/testing.helpers';
import { MockProvider } from 'ng-mocks';
import { SharedService } from '../shared/shared.service';
import { UrlGeneratorService } from './url-generator.service';

describe('UrlGeneratorService', () => {
  let service: UrlGeneratorService;

  const mauroBaseUrl = 'http://test.com';

  beforeEach(
    () =>
      (service = setupTestModuleForService(UrlGeneratorService, {
        providers: [
          MockProvider(SharedService, {
            mauroBaseUrl
          })
        ]
      }))
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each([
    [`${mauroBaseUrl}/#/catalogue/dataClass/1/2/3`, DomainType.DataClass, '1', '2', '3'],
    [
      `${mauroBaseUrl}/#/catalogue/dataElement/1/2/3`,
      DomainType.DataElement,
      '1',
      '2',
      '3'
    ],
    [`${mauroBaseUrl}/#/catalogue/term/1/3`, DomainType.Term, '1', '2', '3'],
    [`${mauroBaseUrl}/#/catalogue/codeSet/3`, DomainType.CodeSet, '1', '2', '3']
  ])(
    'should return %s for domain %o',
    (expected, domainType, modelId, parentId, catalogueId) => {
      const actual = service.getMauroUrl(domainType, modelId, parentId, catalogueId);
      expect(actual).toBe(expected);
    }
  );
});
