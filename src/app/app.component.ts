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

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { ThemingService } from './services/theming.service';

@Component({
  selector: 'nhsd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'nhsd-datadictionary-orchestration';
  themeCssSelector: string = '';

  constructor(
    private theming: ThemingService,
    private overlayContainer: OverlayContainer) { }

  ngOnInit(): void {
    this.setTheme();
  }

  private setTheme() {
    this.themeCssSelector = this.theming.themeCssSelector;

    // Material theme is wrapped inside a CSS class but the overlay container is not part of Angular
    // Material. Have to manually set the correct theme class to this container too
    this.overlayContainer.getContainerElement().classList.add(this.themeCssSelector);
    this.overlayContainer.getContainerElement().classList.add('overlay-container');
  }

}
