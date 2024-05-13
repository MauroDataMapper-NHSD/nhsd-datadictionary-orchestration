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

import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PreviewIndexGroup } from '@mdm/core/data-dictionary/data-dictionary.model';
import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import {
  CommonUiStates,
  StateHandlerService
} from '@mdm/core/state-handler/state-handler.service';
import {
  PreviewDomainType,
  previewIndexDomainMap,
  previewIndexPageTitles,
  PreviewIndexType,
  PreviewIndexItem
} from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { UIRouterGlobals } from '@uirouter/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Breadcrumb } from '../preview-breadcrumb/preview-breadcrumb.model';
import { TableOfContentsLink } from '../preview-toc/preview-toc.model';

@Component({
  selector: 'mdm-preview-index',
  templateUrl: './preview-index.component.html',
  styleUrls: ['./preview-index.component.scss']
})
export class PreviewIndexComponent implements OnInit {
  isLoading = false;
  branch = '';
  index: PreviewIndexType = PreviewIndexType.All;
  domainType: PreviewDomainType = PreviewDomainType.All;
  topics: PreviewIndexGroup[] = [];
  breadcrumbs: Breadcrumb[] = [];
  tableOfContentLinks: TableOfContentsLink[] = [];

  constructor(
    private uiRouterGlobals: UIRouterGlobals,
    private stateHandler: StateHandlerService,
    private dataDictionary: DataDictionaryService,
    private viewportScroller: ViewportScroller,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.branch = this.uiRouterGlobals.params.branch;
    this.index = this.uiRouterGlobals.params.index;

    if (!this.branch || !this.index) {
      this.toastr.error('No branch and/or index type provided for Preview Index page.');
      this.stateHandler.goTo(CommonUiStates.PreviewHome);
      return;
    }

    this.domainType = previewIndexDomainMap.get(this.index) ?? PreviewDomainType.All;

    // Simulate a new static page loaded
    this.viewportScroller.scrollToPosition([0, 0]);

    this.breadcrumbs = [
      {
        label: this.getIndexTitle(),
        uiSref: 'app.container.preview.index',
        uiParams: {
          branch: this.branch,
          index: this.index
        }
      }
    ];

    this.isLoading = true;
    this.dataDictionary
      .getPreviewIndex(this.branch, this.domainType)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((topics) => {
        this.topics = topics;
        this.tableOfContentLinks = this.topics.map((topic) => {
          return {
            label: topic.key,
            anchor: `topic.${topic.key}`
          };
        });
      });
  }

  getIndexTitle() {
    return previewIndexPageTitles.get(this.domainType) ?? '';
  }

  getTableOfContentsLink(topic: PreviewIndexGroup): TableOfContentsLink | undefined {
    return this.tableOfContentLinks.find((toc) => toc.label === topic.key);
  }

  getCssClass(indexItem: PreviewIndexItem): string {
    if (indexItem.isRetired) {
      return indexItem.stereotype + ' retired';
    } else {
      return indexItem.stereotype;
    }
  }

  onTableOfContentsClick(link: TableOfContentsLink) {
    // Simulate an <a href="page#section"> link click
    this.viewportScroller.scrollToAnchor(link.anchor);
  }
}
