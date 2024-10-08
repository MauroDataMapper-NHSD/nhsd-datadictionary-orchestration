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
import { IntegrityCheckCategory } from '@mdm/core/data-dictionary/data-dictionary.model';
import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import { LoggingService } from '@mdm/core/logging/logging.service';
import { Branch } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'mdm-branch-integrity',
  templateUrl: './branch-integrity.component.html',
  styleUrls: ['./branch-integrity.component.scss']
})
export class BranchIntegrityComponent implements OnInit {
  @Input() branch?: Branch;

  running = false;
  categories: IntegrityCheckCategory[] = [];

  get hasCategories() {
    return !!this.categories && this.categories.length > 0;
  }

  constructor(
    private dataDictionary: DataDictionaryService,
    private logging: LoggingService
  ) {}

  ngOnInit(): void {}

  run() {
    if (!this.branch) {
      return;
    }

    this.running = true;

    this.dataDictionary
      .runIntegrityChecks(this.branch.id)
      .pipe(
        catchError((error) => {
          this.logging.error(
            `There was a problem running integrity checks on branch ${this.branch?.branchName}.`,
            error
          );
          return [];
        }),
        finalize(() => (this.running = false))
      )
      .subscribe((categories) => (this.categories = categories));
  }
}
