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

import { Ng2StateDeclaration } from '@uirouter/angular';
import { AppComponent } from '@nhsd/app.component';
import { HomeComponent } from '@nhsd/home/home.component';
import { AppContainerComponent } from '@nhsd/app-container/app-container.component';
import { AboutComponent } from '@nhsd/about/about.component';

export const states: Ng2StateDeclaration[] = [
  {
    name: 'app',
    component: AppComponent
  },   
  {
    name: 'app.container',
    component: AppContainerComponent
  },
  {
    name: 'app.container.default',        
    url: '',
    component: HomeComponent
  },
  {
    name: 'app.container.home',
    url: '/home',
    component: HomeComponent
  },
  {
    name: 'app.container.about',
    url: '/about',
    component: AboutComponent
  }
];