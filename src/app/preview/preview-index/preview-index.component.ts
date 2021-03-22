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
import { CommonUiStates, StateHandlerService } from '@mdm/core/state-handler/state-handler.service';
import { UIRouterGlobals } from '@uirouter/core';

@Component({
  selector: 'mdm-preview-index',
  templateUrl: './preview-index.component.html',
  styleUrls: ['./preview-index.component.scss']
})
export class PreviewIndexComponent implements OnInit {

  indexName: string = '';
  navigationLinks = [
    'A',
    'B',
    'C',
    'D'
  ]

  constructor(
    private uiRouterGlobals: UIRouterGlobals,
    private stateHandler: StateHandlerService,
    private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    this.indexName = this.uiRouterGlobals.params.indexName;
    if (!this.indexName) {
      this.stateHandler.goTo(CommonUiStates.PreviewHome);
      return;
    }
  }

  onAnchorClick(anchor: string) {
    // Simulate an <a href="page#section"> link click
    this.viewportScroller.scrollToAnchor(anchor);
  }

}
