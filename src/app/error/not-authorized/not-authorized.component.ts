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

import { Component } from '@angular/core';
import { SharedService } from '@mdm/services/shared/shared.service';
import { ClipboardService } from 'ngx-clipboard';
import { ErrorComponent } from '../error.component';

@Component({
  selector: 'mdm-not-authorized',
  templateUrl: '../error.component.html'
})
export class NotAuthorizedComponent extends ErrorComponent {

  constructor(
    protected clipboard: ClipboardService,
    protected shared: SharedService
  ) {
    super(clipboard, shared);

    this.heading = 'Not Authorized';
    this.message = 'We\'re sorry, but the server does not allow you to view this page.';
    this.resolution = 'You may need to check that the item you have requested actually exists, and that you have permission to view it';

    this.data.push({ name: 'Message', value: this.lastHttpError?.message, code: false });
    this.data.push({ name: 'Status', value: this.lastHttpError?.status, code: false });
    this.data.push({ name: 'Path', value: this.lastHttpError?.url, code: false });
  }
}
