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

import { IntegrityCheck } from "@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model";

export class IntegrityCheckCategory {
  get checkName() {
    return this.source.checkName;
  }

  get description() {
    return this.source.description;
  }

  get errors() {
    return this.source.errors;
  }

  get hasErrors() {
    return !!this.errors && this.errors.length > 0;
  }

  constructor(private source: IntegrityCheck) { }
}