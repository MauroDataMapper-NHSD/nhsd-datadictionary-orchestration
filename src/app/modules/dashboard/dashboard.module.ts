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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '@nhsd/home/home.component';
import { AboutComponent } from '@nhsd/about/about.component';
import { NavbarComponent } from '@nhsd/navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { UIRouterModule } from '@uirouter/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from '@nhsd/footer/footer.component';
import { UserComponent } from '@nhsd/shared/user/user.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    UserComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UIRouterModule,
    FlexLayoutModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    UserComponent,
    HomeComponent,
    AboutComponent
  ]
})
export class DashboardModule { }
