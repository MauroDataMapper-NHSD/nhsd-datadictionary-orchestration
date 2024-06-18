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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from '@mdm/shared/loading-indicator/loading-indicator.component';
import { MaterialModule } from '@mdm/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UIRouterModule } from '@uirouter/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchSelectorComponent } from './branch-selector/branch-selector.component';
import { DomainIconComponent } from './domain-icon/domain-icon.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AlertComponent } from './alert/alert.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { OpenIdConnectAuthorizeComponent } from './open-id-connect-authorize/open-id-connect-authorize.component';

const components = [
  AlertComponent,
  LoadingIndicatorComponent,
  BranchSelectorComponent,
  DomainIconComponent,
  ScrollToTopComponent,
  OpenIdConnectAuthorizeComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    ...components,
    CommonModule,
    MaterialModule,
    UIRouterModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule
  ]
})
export class SharedModule {}
