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

import { DomainType, MdmResourcesResponse } from "../mdm-resources.model";

/**
 * Represents a branch of the NHS Data Dictionary.
 */
export interface Branch {
  /**
   * The name/label of the branch.
   */
  label: string
}

/**
 * Represents a statistics item to attach to a list of statistics.
 * 
 * **Note:** properties are uppercase due to JSON deserialization of response from the server.
 * 
 * @see Statistics
 */
export interface StatisticsItem {  
  Preparatory?: number;
  Retired?: number;
  Total?: number;
}

/**
 * Represents a collection of statistics.
 * 
 * The property names of the object represent the sections of each `StatisticsItem`.
 */
export interface Statistics {
  [key: string]: StatisticsItem;
}

export type StatisticsResponse = MdmResourcesResponse<Statistics>;

/**
 * Represents the details of a model from Mauro with respect to an integrity check on the Data Dictionary.
 */
export interface IntegrityCheckItem {
  type: string;
  id: string;
  label: string;
  domainType: DomainType;
  parentId: string;
  modelId: string;
}

/**
 * Represents a category, or collection, of integrity check errors found under a certain rule.
 */
export interface IntegrityCheck {
  checkName: string;
  description: string;
  errors: IntegrityCheckItem[];
}

export type IntegrityCheckResponse = MdmResourcesResponse<IntegrityCheck[]>;

/**
 * Represents the different domain types for the dynamic preview pages.
 */
export enum PreviewDomainType {
  DataElements = 'elements',
  Attributes = 'attributes',
  DataClasses = 'classes',
  DataSets = 'dataSets',
  BusinessDefinitions = 'businessDefinitions',
  SupportingInformation = 'supportingInformation',
  XmlSchemaConstraint = 'xmlSchemaConstraint',
  All = 'allItemsIndex'
}

export const previewIndexPageTitles = new Map<PreviewDomainType, string>([
  [PreviewDomainType.DataElements, 'Data Elements'],
  [PreviewDomainType.Attributes, 'Attributes'],
  [PreviewDomainType.DataClasses, 'Classes'],
  [PreviewDomainType.DataSets, 'Data Sets'],
  [PreviewDomainType.BusinessDefinitions, 'Business Definitions'],
  [PreviewDomainType.SupportingInformation, 'Supporting Information'],
  [PreviewDomainType.XmlSchemaConstraint, 'XML Schema Constraints']
]);

/**
 * Represents the stereotypes of each data element returned from the NHS Data Dictionary.
 */
export enum Stereotype {
  DataElement = 'element',
  Attribute = 'attribute',
  DataClass = 'class',
  DataSet = 'dataSet',
  BusinessDefinition = 'businessDefinition',
  SupportingInformation = 'supportingInformation',
  XmlSchemaConstraint = 'xmlSchemaConstraint'
}

export interface PreviewIndexItem {
  catalogueId: string;
  name: string;
  stereotype: Stereotype;
}

export type PreviewIndexResponse = MdmResourcesResponse<PreviewIndexItem[]>

/**
 * Represents the detail of a particular Data Dictionary preview page.
 */
export interface PreviewDetail {
  catalogueId: string;
  name: string;
  stereotype: Stereotype;
  description?: string;
}

export type PreviewDetailResponse = MdmResourcesResponse<PreviewDetail>