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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mdm-preview-expandable-panel',
  templateUrl: './preview-expandable-panel.component.html',
  styleUrls: ['./preview-expandable-panel.component.scss']
})
export class PreviewExpandablePanelComponent implements OnInit {
  @Input()
  title = '';

  @Input()
  anchor?: string;

  @Input()
  expanded = true;

  @Output()
  afterExpand = new EventEmitter<void>();

  @Output()
  afterCollapse = new EventEmitter<void>();

  get expandButtonIcon() {
    return this.expanded ? 'fa-chevron-down' : 'fa-chevron-right';
  }

  constructor() {}

  ngOnInit(): void {}

  onExpandCollapse() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.afterExpand.emit();
    } else {
      this.afterCollapse.emit();
    }
  }
}
