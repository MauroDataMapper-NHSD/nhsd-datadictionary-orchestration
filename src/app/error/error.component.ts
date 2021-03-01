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

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@mdm/services/shared/shared.service';
import { ClipboardService } from 'ngx-clipboard';
import { ErrorData } from './error.model';

@Component({
  selector: 'mdm-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  lastHttpError: HttpErrorResponse | undefined;

  heading = '';
  message = '';
  resolution = '';

  showDetails = false;

  data: ErrorData[] = [];

  constructor(
    protected clipboard: ClipboardService,
    protected shared: SharedService) { 
    this.lastHttpError = this.shared.lastHttpError;
  }

  toggleShowDetails() {
    this.showDetails = !this.showDetails;
  }

  copyToClipboard() {
    this.clipboard.copyFromContent(
      JSON.stringify(this.lastHttpError, null, 2)
    );
  }

}
