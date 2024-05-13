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

/**
 * Enums representing the different status valus a modal dialog could return.
 */
export enum DialogStatus {
  Ok = 'ok',
  Cancel = 'cancel',
  Close = 'close'
}

/**
 * Represents the general result from a modal dialog.
 */
export interface DialogResult {
  /**
   * The status value returned from the closed modal dialog.
   */
  status: DialogStatus;
}
