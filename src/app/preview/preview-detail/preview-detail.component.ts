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

import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import { CommonUiStates, StateHandlerService } from '@mdm/core/state-handler/state-handler.service';
import { PreviewDetail, PreviewDomainType, previewDomainTypeNouns, previewIndexDomainMap, previewIndexPageTitles, PreviewIndexType, PreviewReference, Stereotype, stereotypeMapping } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { UIRouterGlobals } from '@uirouter/angular';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Breadcrumb } from '../preview-breadcrumb/preview-breadcrumb.model';
import { TableOfContentsLink } from '../preview-toc/preview-toc.model';

@Component({
  selector: 'mdm-preview-detail',
  templateUrl: './preview-detail.component.html',
  styleUrls: ['./preview-detail.component.scss']
})
export class PreviewDetailComponent implements OnInit {

  isLoading = false;
  branch = '';
  index: PreviewIndexType = PreviewIndexType.All;
  domainType: PreviewDomainType = PreviewDomainType.All;
  id = '';
  detail?: PreviewDetail;
  breadcrumbs: Breadcrumb[] = [];
  tableOfContentLinks: TableOfContentsLink[] = [];
  isLoadingReferences = false;
  references: PreviewReference[] = [];

  get noun() {
    return previewDomainTypeNouns.get(this.domainType) ?? 'element';
  }

  get aliases() {
    if (!this.detail?.alsoKnownAs) {
      return [];
    }

    return Object
      .entries(this.detail.alsoKnownAs)
      .map(([context, value]) => {
        return { context, value };
      });
  }

  get hasReferencesSection() {
    return this.detail?.stereotype !== Stereotype.XmlSchemaConstraint;
  }

  constructor(
    private uiRouterGlobals: UIRouterGlobals,
    private stateHandler: StateHandlerService,
    private dataDictionary: DataDictionaryService,
    private viewportScroller: ViewportScroller,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.branch = this.uiRouterGlobals.params.branch;
    this.index = this.uiRouterGlobals.params.index;
    this.id = this.uiRouterGlobals.params.id;

    if (!this.branch || !this.index || !this.id) {
      this.toastr.error('No branch and/or index type provided for Preview Index page.');
      this.stateHandler.goTo(CommonUiStates.PreviewHome);
      return;
    }

    this.domainType = previewIndexDomainMap.get(this.index) ?? PreviewDomainType.All;

    // Simulate a new static page loaded
    this.viewportScroller.scrollToPosition([0, 0]);

    this.isLoading = true;
    this.dataDictionary
      .getPreviewDetail(this.branch, this.domainType, this.id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(detail => {
        this.detail = detail;
        this.breadcrumbs = this.createBreadcrumbs(detail);
        this.tableOfContentLinks = this.createTableOfContentLinks(detail);
      });
  }

  getTableOfContentsLink(section: string): TableOfContentsLink | undefined {
    return this.tableOfContentLinks.find(toc => toc.label === section);
  }

  onTableOfContentsClick(link: TableOfContentsLink) {
    // Simulate an <a href="page#section"> link click
    this.viewportScroller.scrollToAnchor(link.anchor);
  }

  onReferencesSectionExpanded() {
    if (this.references.length > 0) {
      return;
    }

    this.isLoadingReferences = true;
    this.dataDictionary
      .getPreviewReferences(this.branch, this.domainType, this.id)
      .pipe(
        finalize(() => this.isLoadingReferences = false)
      )
      .subscribe(references => this.references = references);
  }

  private createBreadcrumbs(detail: PreviewDetail): Breadcrumb[] {
    return [
      {
        label: previewIndexPageTitles.get(this.domainType) ?? '',
        uiSref: 'app.container.preview.index',
        uiParams: {
          branch: this.branch,
          index: this.index
        }
      },
      {
        label: detail.name,
        uiSref: 'app.container.preview.detail',
        uiParams: {
          branch: this.branch,
          index: this.index,
          id: this.id
        }
      }
    ];
  }

  private createTableOfContentLinks(detail: PreviewDetail): TableOfContentsLink[] {
    const links: TableOfContentsLink[] = [];

    if (!detail) {
      return links;
    }

    if (detail.formatLength) {
      links.push({
        label: 'Format / Length',
        anchor: 'format-length'
      });
    }

    if (detail.description) {
      links.push({
        label: 'Description',
        anchor: 'description'
      });
    }

    if (detail.nationalCodes && detail.nationalCodes.length > 0) {
      links.push({
        label: 'National Codes',
        anchor: 'national-codes'
      });
    }

    if (detail.specifications) {
      links.push({
        label: 'Specification',
        anchor: 'specification'
      });
    }

    // Data Class "Attributes" section refers to a table of data
    if (detail.stereotype === Stereotype.DataClass && detail.attributes && detail.attributes.length > 0) {
      links.push({
        label: 'Attributes',
        anchor: 'attributes'
      });
    }

    if (detail.relationships && detail.relationships.length > 0) {
      links.push({
        label: 'Relationships',
        anchor: 'relationships'
      });
    }

    if (this.aliases.length > 0) {
      links.push({
        label: 'Also Known As',
        anchor: 'also-known-as'
      });
    }

    if (this.hasReferencesSection) {
      links.push({
        label: 'Where Used',
        anchor: 'where-used'
      });
    }

    if (detail.dataElements && detail.dataElements.length > 0) {
      links.push({
        label: 'Data Elements',
        anchor: 'data-elements'
      });
    }

    // Non-Data Class "Attributes" section refers to a bullet list of links
    if (detail.stereotype !== Stereotype.DataClass && detail.attributes && detail.attributes.length > 0) {
      links.push({
        label: 'Attributes',
        anchor: 'attributes'
      });
    }

    return links;
  }

  prettifyStereotype(stereotype: string) {
    return stereotypeMapping.get(stereotype as Stereotype)

  }

}
