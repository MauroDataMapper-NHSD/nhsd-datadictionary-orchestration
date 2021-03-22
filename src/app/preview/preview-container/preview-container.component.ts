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
import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import { CommonUiStates, StateHandlerService } from '@mdm/core/state-handler/state-handler.service';
import { Branch } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { UIRouterGlobals } from '@uirouter/core';

@Component({
  selector: 'mdm-preview-container',
  templateUrl: './preview-container.component.html',
  styleUrls: ['./preview-container.component.scss']
})
export class PreviewContainerComponent implements OnInit {

  branches: Branch[] = [];
  selectedBranch = '';

  constructor(
    private dataDictionary: DataDictionaryService,
    private uiRouterGlobals: UIRouterGlobals,
    private stateHandler: StateHandlerService) { }

  ngOnInit(): void {
    this.selectedBranch = this.uiRouterGlobals.params.branch;

    this.dataDictionary
      .getAvailableBranches()
      .subscribe(branches => { this.branches = branches });
  }

  onSelectedBranchChange(name: string) {
    this.stateHandler.goTo(CommonUiStates.PreviewIndex, { branch: name, tabView: null });
  }

}
