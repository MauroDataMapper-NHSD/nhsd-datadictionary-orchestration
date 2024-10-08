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

import { HttpErrorResponse } from '@angular/common/http';

/**
 * Represents a response from an `mdm-resources` API endpoint.
 *
 * @typedef T The type to represent the body of the response.
 */
export interface MdmResourcesResponse<T = any> {
  /**
   * The body of the response from the API.
   */
  body: T;
}

/**
 * Represents the body of a `mdm-resources` response for an index/list request.
 *
 * @typedef T The type to represent each item in the list.
 */
export interface MdmResourcesIndexBody<T = any> {
  /**
   * Gets the number of items in the returned list.
   */
  count: number;

  /**
   * Gets the list of items returned from the API.
   */
  items: T[];
}

/**
 * Type alias for an `mdm-resources` API endpoint response for an index/list request.
 *
 * @typedef T The type to represent each item in the list.
 */
export type MdmResourcesIndexResponse<T = any> = MdmResourcesResponse<
  MdmResourcesIndexBody<T>
>;

/**
 * Represents a generic error from an `mdm-resources` operation.
 */
export class MdmResourcesError {
  constructor(public response: HttpErrorResponse) {}
}

export enum DomainType {
  Folder = 'Folder',
  DataModel = 'DataModel',
  DataClass = 'DataClass',
  DataElement = 'DataElement',
  Terminology = 'Terminology',
  Term = 'Term',
  CodeSet = 'CodeSet',
  Classification = 'Classification',
  ReferenceDataModel = 'ReferenceDataModel',
  EnumerationType = 'EnumerationType'
}

/**
 * Represents a model that can be versioned.
 */
export interface Versionable {
  documentationVersion?: string;
  modelVersion?: string;
  modelVersionTag?: string;
}

/**
 * Represents a model that can be branched for editing new versions.
 */
export interface Branchable {
  branchName?: string;
}

/**
 * Represents a model that provides security information.
 */
export interface Securable {
  readableByEveryone: boolean;
  readableByAuthenticatedUsers: boolean;
}

/**
 * Represents the authority of who issued a model.
 */
export interface Authority {
  id: string;
  url: string;
  label: string;
}

/**
 * Represents the basic model information of a Mauro model.
 */
export interface MauroModel extends Versionable, Branchable {
  id: string;
  domainType: DomainType;
  label: string;
  authority: Authority;
}

/**
 * Represents more detailed information of a Mauro model. Inherits all properties from `MauroModel` by default.
 */
export interface MauroModelDetail extends MauroModel, Securable {
  lastUpdated: string;
  dateFinalised?: string;
}
