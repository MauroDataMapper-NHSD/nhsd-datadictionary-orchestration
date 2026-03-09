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

import { DomainType, MdmResourcesResponse } from '../mdm-resources.model';

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
 * Represents the details of a change paper preview
 *
 */

export interface ChangePaperPreview {
  background: ChangePaperPreviewBackground;
  stereotypes: ChangePaperPreviewStereotype[];
}

export interface ChangePaperPreviewBackground {
  reference: string;
  type: string;
  versionNo: string;
  subject: string;
  effectiveDate: string;
  reasonForChange: string;
  publicationDate: string;
  background: string;
  sponsor: string;
  contactDetails: string;
}

export interface ChangePaperPreviewStereotype {
  name: string;
  changes: ChangePaperPreviewItem[];
}

export interface ChangePaperPreviewItem {
  name: string;
  summary: string;
  htmlOutput: string;
}

export type ChangePaperPreviewResponse = MdmResourcesResponse<ChangePaperPreview>;

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

export interface IntegrityCheckError extends IntegrityCheckItem {
  details?: string[];
}

/**
 * Represents a category, or collection, of integrity check errors found under a certain rule.
 */
export interface IntegrityCheck {
  checkName: string;
  description: string;
  errors: IntegrityCheckError[];
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
  DataSetConstraint = 'dataSetConstraints',
  DataSetFolder = 'dataSetFolders',
  All = 'allItemsIndex'
}

/**
 * Represents the different preview index routes to access.
 *
 * @see previewIndexDomainMap
 */
export enum PreviewIndexType {
  DataElement = 'element',
  Attribute = 'attribute',
  DataClass = 'class',
  DataSet = 'dataSet',
  BusinessDefinition = 'businessDefinition',
  SupportingInformation = 'supportingInformation',
  DataSetConstraint = 'dataSetConstraint',
  DataSetFolder = 'dataSetFolder',
  All = 'allItemsIndex'
}

/**
 * Maps a `PreviewIndexType` to a `PreviewDomainType`
 *
 * This map is required because the page routes do not necessarily match to the backend endpoints. For example, the
 * page `#/preview/element` would trigger the backend endpoint `api/preview/{branch}/elements`
 */
export const previewIndexDomainMap = new Map<PreviewIndexType, PreviewDomainType>([
  [PreviewIndexType.DataElement, PreviewDomainType.DataElements],
  [PreviewIndexType.Attribute, PreviewDomainType.Attributes],
  [PreviewIndexType.DataClass, PreviewDomainType.DataClasses],
  [PreviewIndexType.DataSet, PreviewDomainType.DataSets],
  [PreviewIndexType.BusinessDefinition, PreviewDomainType.BusinessDefinitions],
  [PreviewIndexType.SupportingInformation, PreviewDomainType.SupportingInformation],
  [PreviewIndexType.DataSetConstraint, PreviewDomainType.DataSetConstraint],
  [PreviewIndexType.DataSetFolder, PreviewDomainType.DataSetFolder],
  [PreviewIndexType.All, PreviewDomainType.All]
]);

export const previewIndexPageTitles = new Map<PreviewDomainType, string>([
  [PreviewDomainType.DataElements, 'Data Elements'],
  [PreviewDomainType.Attributes, 'Attributes'],
  [PreviewDomainType.DataClasses, 'Classes'],
  [PreviewDomainType.DataSets, 'Data Sets'],
  [PreviewDomainType.BusinessDefinitions, 'NHS Business Definitions'],
  [PreviewDomainType.SupportingInformation, 'Supporting Information'],
  [PreviewDomainType.DataSetConstraint, 'Data Set Constraints'],
  [PreviewDomainType.DataSetFolder, 'Data Set Folders']
]);

export const previewDomainTypeNouns = new Map<PreviewDomainType, string>([
  [PreviewDomainType.DataElements, 'data element'],
  [PreviewDomainType.Attributes, 'attribute'],
  [PreviewDomainType.DataClasses, 'class'],
  [PreviewDomainType.DataSets, 'data set'],
  [PreviewDomainType.BusinessDefinitions, 'business definition'],
  [PreviewDomainType.SupportingInformation, 'supporting information'],
  [PreviewDomainType.DataSetConstraint, 'data set constraint'],
  [PreviewDomainType.DataSetFolder, 'data set folder']
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
  DataSetConstraint = 'dataSetConstraint',
  DataSetFolder = 'dataSetFolder'
}

export const stereotypeMapping = new Map<Stereotype, string>([
  [Stereotype.DataElement, 'Data Element'],
  [Stereotype.Attribute, 'Attribute'],
  [Stereotype.DataClass, 'Class'],
  [Stereotype.DataSet, 'Data Set'],
  [Stereotype.BusinessDefinition, 'Business Definition'],
  [Stereotype.SupportingInformation, 'Supporting Information'],
  [Stereotype.DataSetConstraint, 'Data Set Constraint'],
  [Stereotype.DataSetFolder, 'Data Set Folder']
]);

export type PreviewIndexResponse = MdmResourcesResponse<NhsDataDictionaryComponent[]>;

export interface PreviewAliases {
  [context: string]: string;
}

export interface PreviewCodeReference {
  code: string;
  description: string;
}

export interface PreviewChangeLog {
  changeRequestUrl: string;
  headerText: string;
  footerText: string;
  entries?: PreviewChangeLogEntry[];
}

export interface PreviewChangeLogEntry {
  description: string;
  implementationDate: string;
  reference: string;
  referenceUrl?: string;
}

export interface PreviewRelationship {
  key: string;
  relationship: string;
  catalogueItemId: string;
  name: string;
  stereotype: Stereotype;
}

/**
 * Represents the detail of a particular Data Dictionary preview page.
 */
export interface NhsDataDictionaryComponent {
  catalogueItemId: string;
  stereotypeForPreview: Stereotype;
  stereotype: string;
  name: string;
  metadataNamespace?: string;
  retired: boolean;
  preparatory: boolean;
  activePage?: boolean;
  shortDescription?: string;
  description?: string;
  htmlDescription?: string;
  changeLog?: PreviewChangeLog;

  childFolders?: NhsDataDictionaryComponent[];
  dataSets?: NhsDataDictionaryComponent[];
  attributeText?: string;
  formatLength?: string;
  relationships?: PreviewRelationship[];
  alsoKnownAs?: PreviewAliases;
  nationalCodes?: PreviewCodeReference[];
  defaultCodes?: PreviewCodeReference[];
  dataElements?: NhsDataDictionaryComponent[];
  attributes?: NhsDataDictionaryComponent[];
  specifications?: string;
  htmlStructure?: string;
  key?: string;
}

export type NhsDataDictionaryComponentResponse = MdmResourcesResponse<NhsDataDictionaryComponent>;
