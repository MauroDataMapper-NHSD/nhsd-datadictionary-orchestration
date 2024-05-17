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

import { Component, Input, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { IntegrityCheckCategory } from '@mdm/core/data-dictionary/data-dictionary.model';
import { UrlGeneratorService } from '@mdm/core/url-generator/url-generator.service';
import { IntegrityCheckItem } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';

@Component({
  selector: 'mdm-branch-integrity-table',
  templateUrl: './branch-integrity-table.component.html',
  styleUrls: ['./branch-integrity-table.component.scss']
})
export class BranchIntegrityTableComponent implements OnInit {
  @Input() categories: IntegrityCheckCategory[] = [];

  selectedCategory?: IntegrityCheckCategory;

  constructor(private urlGenerator: UrlGeneratorService) {}

  ngOnInit(): void {}

  categorySelected(change: MatSelectionListChange) {
    this.selectedCategory = change.options[0].value;
  }

  getDomainTypeUrl(item: IntegrityCheckItem) {
    return this.urlGenerator.getMauroUrl(
      item.domainType,
      item.modelId,
      item.parentId,
      item.id
    );
  }
}
