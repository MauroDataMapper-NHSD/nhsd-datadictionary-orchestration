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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Branch } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';

@Component({
  selector: 'mdm-branch-selector',
  templateUrl: './branch-selector.component.html',
  styleUrls: ['./branch-selector.component.scss']
})
export class BranchSelectorComponent implements OnInit {

  @Input()
  branches: Branch[] = [];

  @Input()
  selectedBranch = '';

  @Output()
  selectedBranchChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onBranchChanged(change: MatSelectChange) {
    this.selectedBranchChange.emit(change.value);
  }

}
