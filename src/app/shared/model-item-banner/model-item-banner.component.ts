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

import { Component, Input, OnInit } from '@angular/core';
import { DataDictionaryModel } from '@mdm/core/dashboard/dashboard.model';

@Component({
  selector: 'mdm-model-item-banner',
  templateUrl: './model-item-banner.component.html',
  styleUrls: ['./model-item-banner.component.scss']
})
export class ModelItemBannerComponent implements OnInit {

  @Input() model?: DataDictionaryModel;

  constructor() { }

  ngOnInit(): void {
  }

}
