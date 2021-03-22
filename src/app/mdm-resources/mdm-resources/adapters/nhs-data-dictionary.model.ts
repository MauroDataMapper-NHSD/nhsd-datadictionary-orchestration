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

import { Authority, DomainType } from "../mdm-resources.model";

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
 * @see Statistics
 */
export interface StatisticsItem {
  total?: number;
  preparatory?: number;
  retired?: number;
}

/**
 * Represents a collection of statistics.
 * 
 * The property names of the object represent the sections of each `StatisticsItem`.
 */
export interface Statistics {
  [key: string]: StatisticsItem;
}

/**
 * Represents the details of a model from Mauro with respect to an integrity check on the Data Dictionary.
 */
export interface IntegrityCheckItem {
  type: string;
  id: string;
  label: string;
  domainType: DomainType;
  parentId: string;
}

/**
 * Represents a category, or collection, of integrity check errors found under a certain rule.
 */
export interface IntegrityCheck {
  checkName: string;
  description: string;
  errors: IntegrityCheckItem[];
}