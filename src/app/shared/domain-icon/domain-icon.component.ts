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
import { DomainType } from '@mdm/mdm-resources/mdm-resources/mdm-resources.model';

export type DomainIconSize = 'fa-sm' | 'fa-md' | 'fa-lg';

const domainTypeIcons = new Map<DomainType, string>([
  [DomainType.Folder, 'fa-folder'],
  [DomainType.DataModel, 'fa-database'],
  [DomainType.Terminology, 'fa-book'],
  [DomainType.CodeSet, 'fa-list'],
  [DomainType.Classification, 'fa-tags'],
  [DomainType.Term, 'fa-code'],
  [DomainType.ReferenceDataModel, 'fa-file-contract'],
  [DomainType.DataElement, 'fa-code'],
  [DomainType.EnumerationType, 'fa-database'],
  [DomainType.DataClass, 'fa-stream']
]);

@Component({
  selector: 'mdm-domain-icon',
  templateUrl: './domain-icon.component.html',
  styleUrls: ['./domain-icon.component.scss']
})
export class DomainIconComponent implements OnInit {

  @Input() type!: DomainType;
  @Input() size: DomainIconSize = 'fa-sm';

  constructor() { }

  ngOnInit(): void {
  }

  getIcon(): string {
    if (!domainTypeIcons.has(this.type)) {
      return '';
    }

    return domainTypeIcons.get(this.type) ?? '';
  }

}
