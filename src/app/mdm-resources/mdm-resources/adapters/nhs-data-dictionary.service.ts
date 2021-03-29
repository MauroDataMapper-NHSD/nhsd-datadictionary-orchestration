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
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Branch, IntegrityCheck, IntegrityCheckResponse, PreviewDetail, PreviewDetailResponse, PreviewDomainType, PreviewIndexItem, PreviewIndexResponse, PreviewReference, PreviewReferenceResponse, Statistics, StatisticsResponse } from './nhs-data-dictionary.model';
import { MdmResourcesService } from '../mdm-resources.service';

@Injectable({
  providedIn: 'root'
})
export class NhsDataDictionaryService {

  constructor(private resources: MdmResourcesService) { }

  availableBranches(): Observable<Branch[]> {
    // TODO: replace with real endpoint
    return of([
      {
        label: 'main'
      },
      // {
      //   label: 'test-branch'
      // },
      // {
      //   label: 'edits'
      // }
    ])
    .pipe(delay(1000));
  }  

  statistics(branch: string): Observable<Statistics> {
    return this.resources.dataDictionary
      .statistics(branch)
      .pipe(
        map((response: StatisticsResponse) => response.body)
      );    
  }

  integrityChecks(branch: string): Observable<IntegrityCheck[]> {
    return this.resources.dataDictionary
      .integrityChecks(branch)
      .pipe(
        map((response: IntegrityCheckResponse) => response.body)
      );
  }

  previewIndex(branch: string, domainType: PreviewDomainType): Observable<PreviewIndexItem[]> {
    return this.resources.dataDictionary
      .preview(branch, domainType)
      .pipe(
        map((response: PreviewIndexResponse) => response.body)
      );
  }

  previewDetail(branch: string, domainType: PreviewDomainType, id: string): Observable<PreviewDetail> {
    return this.resources.dataDictionary
      .preview(branch, domainType, id)
      .pipe(
        map((response: PreviewDetailResponse) => response.body)
      );
  }

  previewReferences(branch: string, domainType: PreviewDomainType, id: string): Observable<PreviewReference[]> {
    return this.resources.dataDictionary
      .previewReferences(branch, domainType, id)
      .pipe(
        map((response: PreviewReferenceResponse) => response.body)
      );
  }
}

