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
import { UIRouterGlobals } from '@uirouter/core';
import { Breadcrumb } from './preview-breadcrumb.model';

@Component({
  selector: 'mdm-preview-breadcrumb',
  templateUrl: './preview-breadcrumb.component.html',
  styleUrls: ['./preview-breadcrumb.component.scss']
})
export class PreviewBreadcrumbComponent implements OnInit, OnChanges {
  /**
   * Get and set the additional items to include apart from "Home".
   */
  @Input()
  items: Breadcrumb[] = [];

  /**
   * Gets the final breadcrumb list to render.
   */
  breadcrumbs: Breadcrumb[] = [];

  constructor(private uiRouterGlobals: UIRouterGlobals) {}

  ngOnInit(): void {
    this.setCrumbs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.setCrumbs();
    }
  }

  private setCrumbs() {
    const branch = this.uiRouterGlobals.params.branch;

    const home: Breadcrumb = {
      label: 'Home',
      uiSref: 'app.container.preview.home',
      uiParams: {
        branch
      }
    };

    this.breadcrumbs = [home].concat(this.items);
  }
}
