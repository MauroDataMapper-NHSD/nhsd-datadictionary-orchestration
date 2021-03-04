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

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggingService } from '@mdm/services/logging/logging.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MdmResourcesService } from '../mdm-resources.service';
import { DataModel, DataModelIndexResponse } from './data-models.model';

@Injectable({
  providedIn: 'root'
})
export class DataModelsService {

  constructor(
    private resources: MdmResourcesService,
    private logging: LoggingService) { }

  list(): Observable<DataModel[]> {
    return this.resources.dataModel
      .list()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.logging.error('There was a problem getting the Data Models.', error);
          return EMPTY;
        }),
        map((response: DataModelIndexResponse) => response.body.items)
      );
  }
}
