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
import { Branch, IntegrityCheck, Statistics } from './nhs-data-dictionary.model';

import * as testIntegrityChecks from '@mdm/testing/nhsdd-integrity-checks.json';

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

  statistics(name: string): Observable<Statistics> {
    // TODO: replace with real endpoint
    return of({
      'Attributes': {
        total: 2480,
        preparatory: 7,
        retired: 1174
      },
      'Data Field Notes': {
        total: 4785,
        preparatory: 32,
        retired: 2184
      },
      'Classes': {
        total: 360,
        preparatory: 0,
        retired: 138
      },
      'Business Definitions': {
        total: 0,
        preparatory: 0,
        retired: 0
      },
      'Supporting Information': {
        total: 0,
        preparatory: 0,
        retired: 0
      },
      'XML Schema Constraints': {
        total: 0,
        preparatory: 0,
        retired: 0
      }
    })
      .pipe(delay(1000));
  }

  integrityChecks(branchName: string): Observable<IntegrityCheck[]> {
    // TODO: replace with real endpoint    
    const json = JSON.parse(JSON.stringify(testIntegrityChecks));
    return of(json.default).pipe(delay(2000));
  }
}