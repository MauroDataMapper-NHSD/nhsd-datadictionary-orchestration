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
import { TableOfContentsLink } from '../preview-toc/preview-toc.model';

@Component({
  selector: 'mdm-preview-detail',
  templateUrl: './preview-detail.component.html',
  styleUrls: ['./preview-detail.component.scss']
})
export class PreviewDetailComponent implements OnInit {

  tableOfContentLinks: TableOfContentsLink[] = [
    {
      label: 'Format / Length',
      anchor: 'format-length'
    },
    {
      label: 'Description',
      anchor: 'description'
    },
    {
      label: 'Also Known As',
      anchor: 'also-known-as'
    },
    {
      label: 'Where Used',
      anchor: 'where-used'
    },
    {
      label: 'Attribute',
      anchor: 'attribute'
    },
  ];

  constructor(private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    // Simulate a new static page loaded
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  onTableOfContentsClick(link: TableOfContentsLink) {
    // Simulate an <a href="page#section"> link click
    this.viewportScroller.scrollToAnchor(link.anchor);
  }
}