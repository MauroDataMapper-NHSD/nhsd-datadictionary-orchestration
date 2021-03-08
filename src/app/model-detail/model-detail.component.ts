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

import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ModelListItem } from '@mdm/services/dashboard/dashboard.model';
import { DashboardService } from '@mdm/services/dashboard/dashboard.service';
import { CodeSetDetail } from '@mdm/services/mdm-resources/adapters/code-sets.model';
import { DataModelDetail } from '@mdm/services/mdm-resources/adapters/data-models.model';
import { TerminologyDetail } from '@mdm/services/mdm-resources/adapters/terminology.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'mdm-model-detail',
  templateUrl: './model-detail.component.html',
  styleUrls: ['./model-detail.component.scss']
})
export class ModelDetailComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() model?: ModelListItem;

  detail: DataModelDetail | CodeSetDetail | TerminologyDetail | undefined;
  loading = false;

  constructor(private dashboard: DashboardService) { }    

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadDetail();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model) {
      this.loadDetail();
    }
  }

  private loadDetail() {
    if (!this.model) {
      return;
    }

    this.loading = true;
    this.dashboard
      .getModelDetail(this.model.domainType, this.model.id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(detail => this.detail = detail);
  }

}
