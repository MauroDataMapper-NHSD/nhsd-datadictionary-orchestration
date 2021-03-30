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

import { IMdmQueryStringParams, IMdmRestHandlerOptions, MdmResource } from "@maurodatamapper/mdm-resources";

export class MdmPluginNhsDataDictionaryResource extends MdmResource {

  availableBranches(queryStringParams?: IMdmQueryStringParams, restHandlerOptions?: IMdmRestHandlerOptions) {
    const url = `${this.apiEndpoint}/nhsdd/branches`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }

  statistics(branch: string, queryStringParams?: IMdmQueryStringParams, restHandlerOptions?: IMdmRestHandlerOptions) {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/statistics`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }

  integrityChecks(branch: string, queryStringParams?: IMdmQueryStringParams, restHandlerOptions?: IMdmRestHandlerOptions) {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/integrityChecks`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }  
  
  preview(branch: string, domainType: string, id?: string, queryStringParams?: IMdmQueryStringParams, restHandlerOptions?: IMdmRestHandlerOptions) {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/preview/${domainType}` + (id ? `/${id}` : '');
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }  

  previewReferences(branch: string, domainType: string, id: string, queryStringParams?: IMdmQueryStringParams, restHandlerOptions?: IMdmRestHandlerOptions) {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/preview/${domainType}/${id}/whereUsed`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }
}