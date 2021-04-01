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
import { LoggingService } from '@mdm/core/logging/logging.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MdmResourcesService } from '../mdm-resources.service';
import { MauroModule, ModulesResponse, Status, StatusResponse } from './mdm-admin.model';

@Injectable({
  providedIn: 'root'
})
export class MdmAdminService {

  constructor(
    private resources: MdmResourcesService,
    private logging: LoggingService) { }

  status(): Observable<Status> {
    return this.resources.admin
      .status()
      .pipe(
        catchError(error => {
          this.logging.error('There was a problem getting the status of Mauro.', error);
          return throwError(error);
        }),
        map((response: StatusResponse) => response.body)
      );
  }

  modules(): Observable<MauroModule[]> {
    return this.resources.admin
      .modules()
      .pipe(
        catchError(error => {
          this.logging.error('There was a problem getting the installed modules list.', error);
          return throwError(error);
        }),
        map((response: ModulesResponse) => response.body)
      );
  }
}
