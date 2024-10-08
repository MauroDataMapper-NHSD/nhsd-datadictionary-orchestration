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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageFile from '../../package.json';

export const environment = {
  version: packageFile?.version ?? '',
  production: false,
  apiEndpoint: 'http://localhost:8080/api',
  themeName: 'nhs-digital',
  mauroBaseUrl: 'http://localhost:4200',
  name: 'development',
  appTitle: 'Data Dictionary Orchestrator',
  appDescription: 'Orchestrates the data dictionary created by NHS England.',
  checkSessionExpiryTimeout: 300000,
  features: {
    useOpenIdConnect: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
