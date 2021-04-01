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

interface TabViewDetail {
  index: number;
  name: string;
}

@Component({
  selector: 'mdm-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss']
})
export class BranchDetailComponent implements OnInit {

  branchName = '';
  details?: Branch;
  activeTab?: TabViewDetail;

  readonly tabs: TabViewDetail[] = [
    { index: 0, name: 'statistics' },
    { index: 1, name: 'integrity'},
    { index: 2, name: 'publish' }
  ];

  readonly defaultTab = this.tabs[0];

  constructor(
    private dataDictionary: DataDictionaryService,
    private uiRouterGlobals: UIRouterGlobals,
    private stateHandler: StateHandlerService) { }

  ngOnInit(): void {
    this.branchName = this.uiRouterGlobals.params.branch;
    if (!this.branchName || this.branchName.length === 0) {
      this.stateHandler.goTo(CommonUiStates.Branches);
      return;
    }

    this.activeTab = this.getTabDetailByName(this.uiRouterGlobals.params.tabView);

    this.dataDictionary
      .getAvailableBranches()
      .subscribe(branches => {
        this.details = branches.find(b => b.branchName === this.branchName);
      });
  }

  getTabDetailByName(name: string): TabViewDetail {
    return this.tabs.find(tab => tab.name === name) ?? this.defaultTab;
  }

  getTabDetailByIndex(index: number): TabViewDetail {
    return this.tabs.find(tab => tab.index === index) ?? this.defaultTab;
  }

  tabSelected(index: number) {
    this.activeTab = this.getTabDetailByIndex(index);
    this.stateHandler.goTo(CommonUiStates.BranchDetail, { tabView: this.activeTab.name }, { notify: false });
  }

}
