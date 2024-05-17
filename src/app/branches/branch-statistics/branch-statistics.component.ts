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

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import {
  Branch,
  Statistics,
  StatisticsItem
} from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { finalize } from 'rxjs/operators';

interface StatisticsTableRow {
  name: string;
  values: StatisticsItem;
}

@Component({
  selector: 'mdm-branch-statistics',
  templateUrl: './branch-statistics.component.html',
  styleUrls: ['./branch-statistics.component.scss']
})
export class BranchStatisticsComponent implements OnInit, OnChanges {
  @Input() branch?: Branch;

  running = false;
  statistics: Statistics = {};
  rows: StatisticsTableRow[] = [];

  constructor(private dataDictionary: DataDictionaryService) {}

  ngOnInit(): void {}

  run(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.branch) {
      this.rows = [];
      this.statistics = {};
      this.running = false;
    }
  }

  private load(): void {
    if (!this.branch) {
      return;
    }

    this.running = true;

    this.dataDictionary
      .getBranchStatistics(this.branch.id)
      .pipe(finalize(() => (this.running = false)))
      .subscribe((statistics) => {
        this.statistics = statistics;
        this.rows = Object.entries(this.statistics).map(([key, value]) => {
          return {
            name: key,
            values: value
          };
        });
      });
  }
}
