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

import { Injectable } from '@angular/core';
import { DomainType } from '@mdm/mdm-resources/mdm-resources/mdm-resources.model';
import { SharedService } from '../shared/shared.service';

type DomainTypeUrlPatternCallback = (modelId: string, parentId: string, catalogueId: string) => string;

@Injectable({
  providedIn: 'root'
})
export class UrlGeneratorService {

  private readonly domainTypeUrlPatterns = new Map<DomainType, DomainTypeUrlPatternCallback>([
    [DomainType.Folder, (modelId, parentId, catalogueId) => `/folder/${catalogueId}`],
    [DomainType.DataModel, (modelId, parentId, catalogueId) => `/dataModel/${catalogueId}`],
    [DomainType.ReferenceDataModel, (modelId, parentId, catalogueId) => `/referenceDataModel/${catalogueId}`],
    [DomainType.Terminology, (modelId, parentId, catalogueId) => `/terminology/${catalogueId}`],
    [DomainType.DataClass, (modelId, parentId, catalogueId) => `/dataClass/${modelId}/${parentId}/${catalogueId}`],
    [DomainType.DataElement, (modelId, parentId, catalogueId) => `/dataElement/${modelId}/${parentId}/${catalogueId}`],
    [DomainType.Classification, (modelId, parentId, catalogueId) => `/classification/${catalogueId}`],
    [DomainType.EnumerationType, (modelId, parentId, catalogueId) => `/enumerationType/${modelId}/${parentId}/${catalogueId}`],
    [DomainType.Term, (modelId, parentId, catalogueId) => `/term/${parentId}/${catalogueId}`],
    [DomainType.CodeSet, (modelId, parentId, catalogueId) => `/codeSet/${catalogueId}`],
  ]);

  constructor(private shared: SharedService) { }

  getMauroUrl(domainType: DomainType, modelId: string, parentId: string, catalogueId: string) : string {
    const converter = this.domainTypeUrlPatterns.get(domainType);
    if (!converter) {
      return '';
    }

    return `${this.shared.mauroBaseUrl}/#/catalogue${converter(modelId, parentId, catalogueId)}`;
  }
}
