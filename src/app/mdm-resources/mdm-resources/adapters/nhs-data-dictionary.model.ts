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
 * Represents a branch of the NHS Data Dictionary.
 */
export interface Branch {
  /**
   * The unique name of the branch
   */
  branchName: string;

  /**
   * The display label for the branch
   */
  label: string;

  /**
   * The UUID of the exact model this branch refers to.
   */
  modelId: string;

  /**
   * The UUID of the exact versionedFolder this branch refers to.
   */
  id: string;

  /**
   * The branch / model version name that should be displayed.
   */
  versionDisplay: string;

  /**
   * A value to indicate if the branch has been finalised.
   */
  modelVersionFinalised: Boolean;
}

export type BranchResponse = MdmResourcesResponse<Branch[]>;

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

export interface StereotypedChange {
  stereotype: string;
  changedItems: ChangedItem[];
}

export interface ChangedItem {
  name: string;
  changes: Change[];
}

export interface Change {
  changeType: string;
  stereotype: string;
  detail: string;
}

/**
 * Represents the details of a change paper preview
 *
 */

export interface ChangePaperPreview {
  reference: string;
  type: string;
  versionNo: string;
  subject: string;
  effectiveDate: string;
  reasonForChange: string;
  publicationDate: string;
  background: string;
  sponsor: string;
  changes: StereotypedChange[];
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

export interface PreviewIndexItem {
  catalogueId: string;
  name: string;
  stereotype: Stereotype;
  isRetired: boolean;
}

export type PreviewIndexResponse = MdmResourcesResponse<PreviewIndexItem[]>;

export interface PreviewAliases {
  [context: string]: string;
}

export interface PreviewCodeReference {
  code: string;
  description: string;
}

/**
 * Represents a cross-reference to another data element in the dictionary.
 */
export interface PreviewElementReference {
  /**
   * The UUID of the catalogue element to reference.
   */
  catalogueId: string;

  /**
   * The name of the element.
   */
  name: string;

  /**
   * The stereotype of the element to correctly identify its type.
   */
  stereotype: Stereotype;

  /**
   * Whether the item is retired or not
   */

  retired: boolean;

  /**
   * Optional key for the reference.
   *
   * This is only used in the case when a Data Class is returned, this key is then used within a table of attributes. If not
   * provided, assume that this is a simple list of references.
   */
  key?: string;
}

export interface PreviewRelationship {
  key: string;
  relationship: string;
  catalogueId: string;
  name: string;
  stereotype: Stereotype;
}

/**
 * Represents the detail of a particular Data Dictionary preview page.
 */
export interface PreviewDetail {
  catalogueId: string;
  name: string;
  stereotype: Stereotype;
  shortDescription?: string;
  formatLength?: string;
  description?: string;
  relationships?: PreviewRelationship[];
  alsoKnownAs?: PreviewAliases;
  nationalCodes?: PreviewCodeReference[];
  defaultCodes?: PreviewCodeReference[];
  dataElements?: PreviewElementReference[];
  attributes?: PreviewElementReference[];
  specifications?: string;
  definition?: string;
  childFolders?: PreviewElementReference[];
  dataSets?: PreviewElementReference[];
}

export type PreviewDetailResponse = MdmResourcesResponse<PreviewDetail>;

/**
 * Represents a reference to another Mauro entity which is related or used in.
 */
export interface PreviewReference {
  name: string;
  stereotype: Stereotype;
  catalogueId: string;
  retired: boolean;
}

export type PreviewReferenceResponse = MdmResourcesResponse<PreviewReference[]>;
