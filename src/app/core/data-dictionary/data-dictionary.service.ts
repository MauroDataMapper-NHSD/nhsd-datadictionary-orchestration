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
import { Branch, IntegrityCheck, Statistics } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { NhsDataDictionaryService } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IntegrityCheckCategory } from './data-dictionary.model';

@Injectable({
  providedIn: 'root'
})
export class DataDictionaryService {

  constructor(private nhsDataDictionary: NhsDataDictionaryService) { }

  getAvailableBranches(): Observable<Branch[]> {
    return this.nhsDataDictionary.availableBranches();
  }

  getBranchStatistics(name: string): Observable<Statistics> {
    return this.nhsDataDictionary.statistics(name);
  }

  runIntegrityChecks(branchName: string): Observable<IntegrityCheckCategory[]> {
    return this.nhsDataDictionary
      .integrityChecks(branchName)
      .pipe(
        map(data => data.map(d => new IntegrityCheckCategory(d)))
      );
  }
}
