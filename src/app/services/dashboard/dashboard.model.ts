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

export class ModelItem implements MauroModel {
  id: string;
  domainType: DomainType;
  label: string;
  authority: Authority;
  documentationVersion?: string;
  modelVersion?: string;
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
    this.documentationVersion = data.documentationVersion;
    this.modelVersion = data.modelVersion;
    this.modelVersionTag = data.modelVersionTag;     
    
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
}