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

import { Injectable } from '@angular/core';
import { DomainType } from '@mdm/mdm-resources/mdm-resources/mdm-resources.model';
import { SharedService } from '../shared/shared.service';

type DomainTypeUrlPatternCallback = (
  modelId: string,
  parentId: string,
  catalogueItemId: string
) => string;

@Injectable({
  providedIn: 'root'
})
export class UrlGeneratorService {
  private readonly domainTypeUrlPatterns = new Map<
    DomainType,
    DomainTypeUrlPatternCallback
  >([
    [DomainType.Folder, (modelId, parentId, catalogueItemId) => `/folder/${catalogueItemId}`],
    [
      DomainType.DataModel,
      (modelId, parentId, catalogueItemId) => `/dataModel/${catalogueItemId}`
    ],
    [
      DomainType.ReferenceDataModel,
      (modelId, parentId, catalogueItemId) => `/referenceDataModel/${catalogueItemId}`
    ],
    [
      DomainType.Terminology,
      (modelId, parentId, catalogueItemId) => `/terminology/${catalogueItemId}`
    ],
    [
      DomainType.DataClass,
      (modelId, parentId, catalogueItemId) =>
        `/dataClass/${modelId}/${parentId}/${catalogueItemId}`
    ],
    [
      DomainType.DataElement,
      (modelId, parentId, catalogueItemId) =>
        `/dataElement/${modelId}/${parentId}/${catalogueItemId}`
    ],
    [
      DomainType.Classification,
      (modelId, parentId, catalogueItemId) => `/classification/${catalogueItemId}`
    ],
    [
      DomainType.EnumerationType,
      (modelId, parentId, catalogueItemId) =>
        `/enumerationType/${modelId}/${parentId}/${catalogueItemId}`
    ],
    [
      DomainType.Term,
      (modelId, parentId, catalogueItemId) => `/term/${modelId}/${catalogueItemId}`
    ],
    [DomainType.CodeSet, (modelId, parentId, catalogueItemId) => `/codeSet/${catalogueItemId}`]
  ]);

  constructor(private shared: SharedService) {}

  getMauroUrl(
    domainType: DomainType,
    modelId: string,
    parentId: string,
    catalogueItemId: string
  ): string {
    const converter = this.domainTypeUrlPatterns.get(domainType);
    if (!converter) {
      return '';
    }

    return `${this.shared.mauroBaseUrl}/#/catalogue${converter(modelId, parentId, catalogueItemId)}`;
  }
}
