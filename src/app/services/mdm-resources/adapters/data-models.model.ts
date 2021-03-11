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

import { MauroModel, MauroModelDetail, MdmResourcesIndexResponse, MdmResourcesResponse } from "../mdm-resources.model";

export enum DataModelType {
  DataStandard = 'Data Standard',
  DataAsset = 'Data Asset'
}

export interface DataModeTraits {
  type: DataModelType;
}

export interface DataModel extends MauroModel, DataModeTraits { }

export interface DataModelDetail extends MauroModelDetail, DataModeTraits { }

export type DataModelIndexResponse = MdmResourcesIndexResponse<DataModel>;

export type DataModelDetailResponse = MdmResourcesResponse<DataModelDetail>;