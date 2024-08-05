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

import {
  QueryParameters,
  RequestSettings,
  MdmResource
} from '@maurodatamapper/mdm-resources';

export class MdmPluginNhsDataDictionaryResource extends MdmResource {
  availableBranches(
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/branches`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }

  statistics(
    branch: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/statistics`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }

  previewChangePaper(
    branch: string,
    includeDataSets: boolean,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/preview/changePaper?includeDataSets=${includeDataSets}`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }

  integrityChecks(
    branch: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/integrityChecks`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }

  preview(
    branch: string,
    domainType: string,
    id?: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url =
      `${this.apiEndpoint}/nhsdd/${branch}/preview/${domainType}` + (id ? `/${id}` : '');
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }

  previewReferences(
    branch: string,
    domainType: string,
    id: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/preview/${domainType}/${id}/whereUsed`;
    return this.simpleGet(url, queryStringParams, restHandlerOptions);
  }

  generateDita(
    branch: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/publish/website`;
    const restOptions = {
      ...restHandlerOptions,
      responseType: 'blob'
    };
    return this.simpleGet(url, queryStringParams, restOptions);
  }

  generateCodeSystems(
    branch: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/publish/codeSystem/validateBundle`;
    const restOptions = {
      ...restHandlerOptions,
      responseType: 'blob'
    };
    return this.simpleGet(url, queryStringParams, restOptions);
  }

  generateValueSets(
    branch: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/publish/valueSet/validateBundle`;
    const restOptions = {
      ...restHandlerOptions,
      responseType: 'blob'
    };
    return this.simpleGet(url, queryStringParams, restOptions);
  }

  generateChangePaper(
    branch: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/publish/changePaper`;
    const restOptions = {
      ...restHandlerOptions,
      responseType: 'blob'
    };
    return this.simpleGet(url, queryStringParams, restOptions);
  }

  generateChangePaperWithDataSet(
    branch: string,
    queryStringParams?: QueryParameters,
    restHandlerOptions?: RequestSettings
  ): any {
    const url = `${this.apiEndpoint}/nhsdd/${branch}/publish/changePaper`;
    const restOptions = {
      ...restHandlerOptions,
      responseType: 'blob'
    };
    if (!queryStringParams) {
      queryStringParams = [];
    }
    queryStringParams.dataSets = true;

    return this.simpleGet(url, queryStringParams, restOptions);
  }
}
