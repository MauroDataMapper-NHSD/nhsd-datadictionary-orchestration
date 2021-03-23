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

type DomainTypeUrlPatternCallback = (id: string, parentId: string) => string;

@Injectable({
  providedIn: 'root'
})
export class UrlGeneratorService {

  private readonly domainTypeUrlPatterns = new Map<DomainType, DomainTypeUrlPatternCallback>([
    [DomainType.Folder, (id, _) => `/folder/${id}`],
    [DomainType.DataModel, (id, _) => `/dataModel/${id}`],
    [DomainType.ReferenceDataModel, (id, _) => `/referenceDataModel/${id}`],
    [DomainType.Terminology, (id, _) => `/terminology/${id}`],
    [DomainType.DataClass, (id, parentId) => `/dataClass/${parentId}//${id}`],
    [DomainType.DataElement, (id, parentId) => `/dataElement/${parentId}//${id}`],
    [DomainType.Classification, (id, _) => `/classification/${id}`],
    [DomainType.EnumerationType, (id, parentId) => `/enumerationType/${parentId}//${id}`],
    [DomainType.Term, (id, parentId) => `/term/${parentId}/${id}`],
    [DomainType.CodeSet, (id, _) => `/codeSet/${id}`],
  ]);

  constructor(private shared: SharedService) { }

  getDomainTypeUrl(domainType: DomainType, id: string, parentId: string) : string {
    const converter = this.domainTypeUrlPatterns.get(domainType);
    if (!converter) {
      return '';
    }

    return `${this.shared.mauroBaseUrl}/#/catalogue${converter(id, parentId)}`;
  }  
}
