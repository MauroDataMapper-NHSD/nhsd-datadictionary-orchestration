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
import { ModelItem, ModelItemType } from '@mdm/services/dashboard/dashboard.model';
import { DashboardService } from '@mdm/services/dashboard/dashboard.service';
import { DomainType } from '@mdm/services/mdm-resources/mdm-resources.model';

@Component({
  selector: 'mdm-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {

  models!: ModelItem[];

  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    this.dashboard
      .getModels()
      .subscribe(models => this.models = models);
  }

  getIcon(item: ModelItem): string {
    switch (item.domainType) {
      case DomainType.DataModel:     
        if (item.type === ModelItemType.DataStandard) {
          return 'fa-file-alt';
        }
        if (item.type === ModelItemType.DataAsset) {
          return 'fa-database';
        }
        return '';
      case DomainType.CodeSet:
        return 'fa-list';
      case DomainType.Terminology:
        return 'fa-code';
      default:
        return '';
    }
  }
}
