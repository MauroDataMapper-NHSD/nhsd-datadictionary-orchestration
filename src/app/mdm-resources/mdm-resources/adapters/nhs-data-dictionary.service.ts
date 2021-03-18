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
import { delay } from 'rxjs/operators';
import { DomainType } from '../mdm-resources.model';
import { Branch, BranchDetails, IntegrityCheckResult, Statistics } from './nhs-data-dictionary.model';

@Injectable({
  providedIn: 'root'
})
export class NhsDataDictionaryService {

  constructor() { }

  availableBranches(): Observable<Branch[]> {
    // TODO: replace with real endpoint
    return of([
      {
        label: 'main'
      },
      {
        label: 'test-branch'
      },
      {
        label: 'edits'
      }
    ])
    .pipe(delay(1000));
  }

  branch(name: string): Observable<BranchDetails> {
    // TODO: replace with real endpoint
    return of({
      id: '1234-5678',
      label: name,
      authority: {
        id: '111',
        label: 'NHS Digital',
        url: 'http://localhost:8080'
      },
      domainType: DomainType.DataModel,
      lastUpdated: '2021-03-10T15:17:05.459Z'
    })
    .pipe(delay(1000));
  }

  statistics(name: string): Observable<Statistics> {
    // TODO: replace with real endpoint
    return of({
      'Attributes': {
        total: 2480,
        retired: 1174
      },
      'Data Field Notes': {
        total: 4785,
        retired: 2184
      },
      'Classes': {
        total: 360,
        retired: 138
      },
      'Business Definitions': {
        total: 0,
        retired: 0
      },
      'Supporting Information': {
        total: 0,
        retired: 0
      },
      'XML Schema Constraints': {
        total: 0,
        retired: 0
      }
    })
      .pipe(delay(1000));
  }

  integrityChecks(branchName: string): Observable<IntegrityCheckResult[]> {
    // TODO: replace with real endpoint
    return of([
      {
        message: 'Integrity message 1'
      },
      {
        message: 'Integrity message 2'
      },
      {
        message: 'Integrity message 3'
      }
    ])
    .pipe(delay(5000));
  }
}
