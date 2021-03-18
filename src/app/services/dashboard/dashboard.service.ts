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
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CodeSetDetail } from '../mdm-resources/adapters/code-sets.model';
import { CodeSetsService } from '../mdm-resources/adapters/code-sets.service';
import { DataModelDetail } from '../mdm-resources/adapters/data-models.model';
import { DataModelsService } from '../mdm-resources/adapters/data-models.service';
import { TerminologyDetail } from '../mdm-resources/adapters/terminology.model';
import { TerminologyService } from '../mdm-resources/adapters/terminology.service';
import { DomainType } from '../mdm-resources/mdm-resources.model';
import { DataDictionaryModel } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private dataModel: DataModelsService,
    private codeSet: CodeSetsService,
    private terminology: TerminologyService) { }

  getModels(): Observable<DataDictionaryModel[]> {
    return combineLatest([
      this.dataModel.list(),
      this.codeSet.list(),
      this.terminology.list()
    ])
      .pipe(
        map(([dataModels, codeSets, termologies]) => {
          const d = dataModels.map(d => new DataDictionaryModel(d));
          const c = codeSets.map(c => new DataDictionaryModel(c));
          const t = termologies.map(t => new DataDictionaryModel(t));
          return d.concat(c, t);
        })
      )
  }

  getModelDetail(domainType: DomainType, id: string): Observable<DataModelDetail | CodeSetDetail | TerminologyDetail | undefined> {
    if (domainType === DomainType.DataModel) {
      return this.dataModel.get(id);
    }

    if (domainType === DomainType.CodeSet) {
      return this.codeSet.get(id);
    }

    if (domainType === DomainType.Terminology) {
      return this.terminology.get(id);
    }

    return of(undefined);
  }
}
