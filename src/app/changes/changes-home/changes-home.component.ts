/*
Copyright 2021-2024 NHS England

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
*/

import { Component, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/core';
import {
  CommonUiStates,
  StateHandlerService
} from '@mdm/core/state-handler/state-handler.service';
import {
  Branch,
  ChangePaperPreview
} from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'mdm-changes-home',
  templateUrl: './changes-home.component.html',
  styleUrls: ['./changes-home.component.scss']
})
export class ChangesHomeComponent implements OnInit {
  branchId = '';
  branch?: Branch;
  running = false;
  changePaperPreview: ChangePaperPreview | undefined;

  constructor(
    private dataDictionary: DataDictionaryService,
    private uiRouterGlobals: UIRouterGlobals,
    private stateHandler: StateHandlerService
  ) {}

  run(): void {
    this.load();
  }

  ngOnInit(): void {
    this.branchId = this.uiRouterGlobals.params.branch;
    if (!this.branchId || this.branchId.length === 0) {
      this.stateHandler.goTo(CommonUiStates.ChangesHome);
      return;
    }

    this.dataDictionary.getAvailableBranches().subscribe((branches) => {
      this.branch = branches.find((b) => b.id === this.branchId);
    });
  }

  private load(): void {
    if (!this.branchId) {
      return;
    }

    this.running = true;

    this.dataDictionary
      .getChangePaperPreview(this.branchId)
      .pipe(finalize(() => (this.running = false)))
      .subscribe((changePaperPreview) => {
        this.changePaperPreview = changePaperPreview;
        console.log(this.changePaperPreview);
      });
  }
}
