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
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  constructor(private toastr: ToastrService) {}

  success(message: string) {
    this.toastr.success(message);
  }

  warning(message: string) {
    this.toastr.warning(message);
  }

  error(message: string, response?: HttpErrorResponse) {
    if (response && response.status === 422) {
      const httpError = this.getHttpErrorText(response) ?? message;
      this.toastr.error(httpError);
      return;
    }

    this.toastr.error(message);
  }

  private getHttpErrorText(response: HttpErrorResponse) {
    const errors = response.error?.errors;
    const validationErrors = response.error?.validationErrors?.errors;

    if (errors) {
      return errors[0].message;
    }

    if (validationErrors) {
      return validationErrors[0].message;
    }

    return null;
  }
}
