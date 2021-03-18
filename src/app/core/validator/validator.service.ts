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

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  // eslint-disable-next-line no-useless-escape
  readonly emailPattern = /^[_A-Za-z0-9-'!#%&=\/~\`\+\$\*\?\^\{\|\}]+(\.[_A-Za-z0-9-'!#%&=\/~\`\+\$\*\?\^\{\|\}]+)*@[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-\+]+)*(\.[A-Za-z]{2,})$/;

  isEmail(value: string): boolean {
    return this.emailPattern.test(value);
  }

  isDate(date: any): boolean {
    if (!isNaN(date)) {
      return date instanceof Date;
    }

    return false;
  }

  isEmpty(str: string): boolean {
    if (str === null || str === undefined) {
      return true;
    }

    if (typeof str === 'string' && str.trim().length === 0) {
      return true;
    }

    return false;
  }
}
