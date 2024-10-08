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

import { Injectable } from '@angular/core';
import {
  MdmSecurityResource,
  MdmResourcesConfiguration,
  MdmSessionResource,
  MdmAdminResource,
  MdmApiPropertyResources,
  MdmPluginOpenIdConnectResource
} from '@maurodatamapper/mdm-resources';
import { MdmRestHandlerService } from '../mdm-rest-handler/mdm-rest-handler.service';
import { MdmPluginNhsDataDictionaryResource } from '../plugins/mdm-plugin-nhs-data-dictionary.resource';

@Injectable({
  providedIn: 'root'
})
export class MdmResourcesService {
  apiProperties = new MdmApiPropertyResources(this.resourcesConfig, this.restHandler);
  security = new MdmSecurityResource(this.resourcesConfig, this.restHandler);
  session = new MdmSessionResource(this.resourcesConfig, this.restHandler);
  admin = new MdmAdminResource(this.resourcesConfig, this.restHandler);
  dataDictionary = new MdmPluginNhsDataDictionaryResource(
    this.resourcesConfig,
    this.restHandler
  );
  pluginOpenIdConnect = new MdmPluginOpenIdConnectResource(
    this.resourcesConfig,
    this.restHandler
  );

  constructor(
    private resourcesConfig: MdmResourcesConfiguration,
    private restHandler: MdmRestHandlerService
  ) {}
}
