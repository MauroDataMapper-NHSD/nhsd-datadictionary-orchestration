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

import { DataModel, DataModelType } from "../mdm-resources/adapters/data-models.model";
import { Authority, DomainType, MauroModel } from "../mdm-resources/mdm-resources.model";

export enum ModelItemType {  
  DataStandard = 'Data Standard',
  DataAsset = 'Data Asset'
}

export class Version {
  major = 0;
  minor = 0;
  patch = 0;

  constructor(str: string) {
    if (!str || str.length === 0) {
      throw new Error('No version string provided');
    }
    
    const parts = str.split('.');
    if (!parts || parts.length < 3) {
      throw new Error(`Version string "${str}" is not in expected format`);
    }

    this.major = parseInt(parts[0]) || 0;
    this.minor = parseInt(parts[1]) || 0;
    this.patch = parseInt(parts[2]) || 0;
  }

  toString() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  compareTo(other?: Version) {    
    if (this === other) {
      return 0;
    }

    if (!other) {
      return 1;
    }

    if (this.major !== other.major) {
      return this.major > other.major ? 1 : -1;
    }

    if (this.minor !== other.minor) {
      return this.minor > other.minor ? 1 : -1;
    }

    if (this.patch !== other.patch) {
      return this.patch > other.patch ? 1: -1;
    }

    return 0;
  }
}

export class ModelListItem {
  id: string;
  domainType: DomainType;
  label: string;
  authority: Authority;
  documentationVersion?: Version;
  modelVersion?: Version;
  modelVersionTag?: string;
  branchName?: string;
  type?: ModelItemType;

  get hasBranch(): boolean {
    return !!this.branchName;
  }

  get isFinalised(): boolean {
    return !!this.modelVersion;
  }

  constructor(data: MauroModel) {
    this.id = data.id;
    this.domainType = data.domainType;
    this.label = data.label;
    this.authority = data.authority;
    this.branchName = data.branchName;
    this.modelVersionTag = data.modelVersionTag;     

    if (data.documentationVersion) {
      this.documentationVersion = new Version(data.documentationVersion);
    }

    if (data.modelVersion) {
      this.modelVersion = new Version(data.modelVersion);
    }
    
    if ((<DataModel>data).type) { 
      const dataModel = <DataModel>data;
      switch (dataModel.type) {
        case DataModelType.DataStandard:
          this.type = ModelItemType.DataStandard;          
          break;
        case DataModelType.DataAsset:
          this.type = ModelItemType.DataAsset;
          break;
      }
    }
  }

  getIcon(): string {
    switch (this.domainType) {
      case DomainType.DataModel:     
        if (this.type === ModelItemType.DataStandard) {
          return 'fa-file-alt';
        }
        if (this.type === ModelItemType.DataAsset) {
          return 'fa-database';
        }
        return '';
      case DomainType.CodeSet:
        return 'fa-list';
      case DomainType.Terminology:
        return 'fa-code';
      default:
        return '';
    }
  }

  compareTo(other?: ModelListItem) {
    if (this === other) {
      return 0;
    }

    if (!other) {
      return 1;
    }

    let result = this.label.localeCompare(other.label);
    if (result !== 0)
    {
      return result;
    }

    if (this.modelVersion) {
      result = this.modelVersion.compareTo(other.modelVersion);
      if (result !== 0) {
        return result;
      }
    }

    if (this.branchName) {
      if (!other.branchName) {
        return 1;
      }

      result = this.branchName.localeCompare(other.branchName);
    }

    return result;
  }
}