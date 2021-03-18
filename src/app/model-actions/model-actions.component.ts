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

import { Component, Input, OnInit } from '@angular/core';
import { DataDictionaryModel } from '@mdm/core/dashboard/dashboard.model';
import { SecurityService } from '@mdm/core/security/security.service';

@Component({
  selector: 'mdm-model-actions',
  templateUrl: './model-actions.component.html',
  styleUrls: ['./model-actions.component.scss']
})
export class ModelActionsComponent implements OnInit {

  @Input() model?: DataDictionaryModel;

  constructor(private security: SecurityService) { }

  get canPreview(): boolean {
    // TODO: add permissions checks for preview
    return true;
  }

  get canCheckIntegrity(): boolean {
    // TODO: add permissions checks for integrity checks
    return true;
  }

  get canPublish(): boolean {
    const user = this.security.getCurrentUser();
    if (!user) {
      return false;
    }

    if (!user.isAdmin) {
      return false;
    }

    // TODO: add permissions checks for publish
    return this.model?.isFinalised ?? false;
  }

  ngOnInit(): void {
  }

}
