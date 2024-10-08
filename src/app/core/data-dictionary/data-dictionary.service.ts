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

import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Branch,
  ChangePaperPreview,
  PreviewDetail,
  PreviewDomainType,
  PreviewIndexItem,
  PreviewReference,
  Statistics
} from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { NhsDataDictionaryService } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoggingService } from '../logging/logging.service';
import { IntegrityCheckCategory, PreviewIndexGroup } from './data-dictionary.model';

@Injectable({
  providedIn: 'root'
})
export class DataDictionaryService {
  constructor(
    private nhsDataDictionary: NhsDataDictionaryService,
    private logging: LoggingService
  ) {}

  getAvailableBranches(): Observable<Branch[]> {
    return this.nhsDataDictionary.availableBranches().pipe(
      catchError((error) => {
        this.logging.error('There was a problem finding available branches.', error);
        return throwError(error);
      })
    );
  }

  getBranchStatistics(branch: string): Observable<Statistics> {
    return this.nhsDataDictionary.statistics(branch).pipe(
      catchError((error) => {
        this.logging.error(
          `There was a problem getting statistics for the "${branch}" branch.`,
          error
        );
        return throwError(error);
      })
    );
  }

  getChangePaperPreview(
    branch: string,
    includeDataSets: boolean
  ): Observable<ChangePaperPreview> {
    return this.nhsDataDictionary.previewChangePaper(branch, includeDataSets).pipe(
      catchError((error) => {
        this.logging.error(
          `There was a problem getting change paper preview for the "${branch}" branch.`,
          error
        );
        return throwError(error);
      })
    );
  }

  runIntegrityChecks(branch: string): Observable<IntegrityCheckCategory[]> {
    return this.nhsDataDictionary.integrityChecks(branch).pipe(
      catchError((error) => {
        this.logging.error(
          `There was a problem running integrity checks for the "${branch}" branch.`,
          error
        );
        return throwError(error);
      }),
      map((data) => data.map((d) => new IntegrityCheckCategory(d)))
    );
  }

  getPreviewIndex(
    branch: string,
    domainType: PreviewDomainType
  ): Observable<PreviewIndexGroup[]> {
    return this.nhsDataDictionary.previewIndex(branch, domainType).pipe(
      catchError((error) => {
        this.logging.error(
          `There was a problem getting the preview index ${domainType} for the "${branch}" branch.`,
          error
        );
        return throwError(error);
      }),
      map((items) => {
        const groups = items.groupBy((item: PreviewIndexItem) =>
          item.name[0].toUpperCase()
        );
        return Object.keys(groups).map((key) => {
          return {
            key,
            items: groups[key]
          };
        });
      })
    );
  }

  getPreviewDetail(
    branch: string,
    domainType: PreviewDomainType,
    id: string
  ): Observable<PreviewDetail> {
    return this.nhsDataDictionary.previewDetail(branch, domainType, id).pipe(
      catchError((error) => {
        this.logging.error(
          `There was a problem getting the preview detail ${domainType} for the "${branch}" branch.`,
          error
        );
        return throwError(error);
      })
    );
  }

  getPreviewReferences(
    branch: string,
    domainType: PreviewDomainType,
    id: string
  ): Observable<PreviewReference[]> {
    return this.nhsDataDictionary.previewReferences(branch, domainType, id).pipe(
      catchError((error) => {
        this.logging.error(
          `There was a problem getting the preview references for ${domainType} for the "${branch}" branch.`,
          error
        );
        return throwError(error);
      })
    );
  }

  generateDita(branch: string): Observable<HttpResponse<Blob>> {
    return this.nhsDataDictionary.generateDita(branch).pipe(
      catchError((error) => {
        if (error.status === 403) {
          this.logging.warning('You do not have permission to generate the DITA');
        } else {
          this.logging.error(
            `There was a problem generating the DITA for the "${branch}" branch.`,
            error
          );
        }
        return throwError(error);
      })
    );
  }

  generateCodeSystems(branch: string): Observable<HttpResponse<Blob>> {
    return this.nhsDataDictionary.generateCodeSystems(branch).pipe(
      catchError((error) => {
        if (error.status === 403) {
          this.logging.warning(
            'You do not have permission to generate the FHIR CodeSystem Resource Bundle'
          );
        } else {
          this.logging.error(
            `There was a problem generating the FHIR CodeSystems for the "${branch}" branch.`,
            error
          );
        }
        return throwError(error);
      })
    );
  }

  generateValueSets(branch: string): Observable<HttpResponse<Blob>> {
    return this.nhsDataDictionary.generateValueSets(branch).pipe(
      catchError((error) => {
        if (error.status === 403) {
          this.logging.warning(
            'You do not have permission to generate the FHIR ValueSet Resource Bundle'
          );
        } else {
          this.logging.error(
            `There was a problem generating the FHIR ValueSets for the "${branch}" branch.`,
            error
          );
        }
        return throwError(error);
      })
    );
  }

  generateChangePaper(branch: string): Observable<HttpResponse<Blob>> {
    return this.nhsDataDictionary.generateChangePaper(branch).pipe(
      catchError((error) => {
        this.logging.error(
          `There was a problem generating the Change Paper for the "${branch}" branch.`,
          error
        );
        return throwError(error);
      })
    );
  }

  generateChangePaperWithDataSet(branch: string): Observable<HttpResponse<Blob>> {
    return this.nhsDataDictionary.generateChangePaperWithDataSet(branch).pipe(
      catchError((error) => {
        this.logging.error(
          `There was a problem generating the Change Paper for the "${branch}" branch.`,
          error
        );
        return throwError(error);
      })
    );
  }
}
