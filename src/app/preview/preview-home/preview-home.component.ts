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
import { UIRouterGlobals } from '@uirouter/core';
import { PreviewTile } from '../preview-tile/preview-tile.model';

@Component({
  selector: 'mdm-preview-home',
  templateUrl: './preview-home.component.html',
  styleUrls: ['./preview-home.component.scss']
})
export class PreviewHomeComponent implements OnInit {

  readonly tiles: PreviewTile[] = [
    {
      id: 'about',
      title: 'About the NHS Data Model and Dictionary',
      description: 'The purpose of the NHS Data Model and Dictionary and other complementary resources and services.',
      uiSref: 'app.container.preview.about'
    },
    {
      id: 'contact_us_and_faq_overview_overview',
      title: 'Help and guidance',
      description: 'Contact our helpdesk to submit a query and guidance relating to the content of the NHS Data Model and Dictionary.',
      uiSref: 'app.container.preview.about'
    },
    {
      id: 'dataSet_overview',
      title: 'Data Sets',
      description: 'Data Sets provide the specification for data collections and for data analyses.',
      uiSref: 'app.container.preview.index',
      uiParams: {
        branch: this.uiRouterGlobals.params.branch,
        index: 'data-sets'
      }
    },
    {
      id: 'dataElement_overview',
      title: 'Data Elements',
      description: 'Data Elements are the data items used within Data Sets.',
      uiSref: 'app.container.preview.index',
      uiParams: {
        branch: this.uiRouterGlobals.params.branch,
        index: 'data-elements'
      }
    },
    {
      id: 'attribute_overview',
      title: 'Attributes',
      description: 'The part of the data model describing the characteristics of Classes. Attributes define the data within the data model.',
      uiSref: 'app.container.preview.index',
      uiParams: {
        branch: this.uiRouterGlobals.params.branch,
        index: 'attributes'
      }
    },
    {
      id: 'class_overview',
      title: 'Classes',
      description: 'The part of the data model describing the aspects of the health and care business with significant characteristics.',
      uiSref: 'app.container.preview.index',
      uiParams: {
        branch: this.uiRouterGlobals.params.branch,
        index: 'classes'
      }
    },
    {
      id: 'business_definitions_overview',
      title: 'NHS Business Definitions',
      description: 'The part of the data model that links the logical classes to the context of the health and care business.',
      uiSref: 'app.container.preview.index',
      uiParams: {
        branch: this.uiRouterGlobals.params.branch,
        index: 'business-definitions'
      }
    },
    {
      id: 'supporting_information_overview',
      title: 'Supporting Information',
      description: 'Provide information to help users understand content in the NHS Data Model and Dictionary.',
      uiSref: 'app.container.preview.index',
      uiParams: {
        branch: this.uiRouterGlobals.params.branch,
        index: 'supporting-information'
      }
    },
    {
      id: 'all_items_index_overview',
      title: 'All Items Index',
      description: 'Lists all the items in the dictionary in alphabetical order.',
      uiSref: 'app.container.preview.about'
    },
  ];

  constructor(private uiRouterGlobals: UIRouterGlobals) { }

  ngOnInit(): void {
  }

}
