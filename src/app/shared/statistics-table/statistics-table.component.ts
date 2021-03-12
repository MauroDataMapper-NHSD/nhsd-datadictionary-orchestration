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
import { DashboardService } from '@mdm/services/dashboard/dashboard.service';
import { Statistics, StatisticsItem } from '@mdm/services/mdm-resources/adapters/nhs-data-dictionary.model';
import { finalize } from 'rxjs/operators';

interface StatisticsTableRow {
  name: string;
  values: StatisticsItem;
}

@Component({
  selector: 'mdm-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss']
})
export class StatisticsTableComponent implements OnInit {

  loading = false;
  statistics: Statistics = {};
  rows: StatisticsTableRow[] = [];

  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this.loading = true;

    this.dashboard
      .getStatistics()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(statistics => {
        this.statistics = statistics;
        this.rows = Object.entries(this.statistics).map(([key, value]) => {
          return {
            name: key,
            values: value
          }
        });
      });
  }

}
