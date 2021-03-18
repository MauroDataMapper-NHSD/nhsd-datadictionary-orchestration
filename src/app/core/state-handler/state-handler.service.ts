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

import { Injectable } from '@angular/core';
import { RawParams, TransitionOptions, UIRouter } from '@uirouter/angular';

export enum CommonUiStates {
  Default,
  Branches
}

@Injectable({
  providedIn: 'root'
})
export class StateHandlerService {

  private readonly commonStates: { key: CommonUiStates, state: string}[] = [
    { key: CommonUiStates.Default, state: 'app.container.default' },
    { key: CommonUiStates.Branches, state: 'app.container.branches.default' }
  ];

  constructor(private router: UIRouter) { }

  go(name: string, params?: RawParams, options?: TransitionOptions) {
    return this.router.stateService.go(name, params, options);
  }

  goTo(state: CommonUiStates, params?: RawParams, options?: TransitionOptions) {
    const commonState = this.commonStates.find(s => s.key === state);
    if (!commonState) {
      throw new Error(`Cannot find common state ${state}`);
    }

    return this.go(commonState.state, params, options);
  }
}
