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

import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@mdm/core/security/security.service';
import { SharedService } from '@mdm/core/shared/shared.service';
import { mauroDataMapperVersionStatusKey, nhsDataDictionaryPluginModuleKey } from '@mdm/mdm-resources/mdm-resources/adapters/mdm-admin.model';
import { MdmAdminService } from '@mdm/mdm-resources/mdm-resources/adapters/mdm-admin.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'mdm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  isLoading = false;
  isSignedIn = false;
  appVersion: string;
  mauroVersion = '';
  nhsDdPluginVersion = '';

  constructor(
    private shared: SharedService,
    private security: SecurityService,
    private admin: MdmAdminService) {
    this.appVersion = this.shared.appVersion;
  }

  ngOnInit(): void {
    this.isSignedIn = this.security.isSignedIn();

    if (this.isSignedIn) {
      this.isLoading = true;

      forkJoin([
        this.admin.status(),
        this.admin.modules()
      ])
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(([status, modules]) => {
        this.mauroVersion = status[mauroDataMapperVersionStatusKey];
        this.nhsDdPluginVersion = modules.find(module => module.name === nhsDataDictionaryPluginModuleKey)?.version ?? '';
      });
    }
  }

}
