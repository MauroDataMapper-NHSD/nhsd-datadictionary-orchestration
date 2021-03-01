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

import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { filter, map, mergeMap } from "rxjs/operators";
import { ConfirmationModalComponent } from "./confirmation-modal/confirmation-modal.component";
import { ConfirmationModalConfig, ConfirmationModalResult } from "./confirmation-modal/confirmation-modal.model";
import { ModalDialogStatus } from "./modal.model";

declare module '@angular/material/dialog/dialog' {
  interface MatDialog {
    /**
     * Extension method to open a modal dialog containing the `ConfirmationModalComponent`.
     *
     * @param config The dialog configuration to supply.
     * @returns Reference to the newly opened dialog.
     *
     * A complete `ModalDialogRef` object is returned to handle specific dialog actions. If requiring simpler
     * confirmation dialogs, consider using `openConfirmationAsync()` instead.
     *
     * @see `ConfirmationModalComponent`
     * @see `ConfirmationModalConfig`
     * @see `ConfirmationModalResult`
     */
    openConfirmationDialog(config: MatDialogConfig<ConfirmationModalConfig>): MatDialogRef<ConfirmationModalComponent, ConfirmationModalResult>;

    /**
     * Extension method to open a modal dialog containing the `ConfirmationModalComponent` and asynchronously
     * return the success result.
     *
     * @param config The dialog configuration to supply.
     * @returns An `Observable<void>` to subscribe to for acting when the user clicks "OK".
     *
     * An observable is returned so that the actions to perform after selecting "OK" can be carried out when ready. In the case
     * when the dialog is cancelled, these actions will not be carried out.
     *
     * @example
     *
     * ```ts
     * dialog.openConfirmation(config)
     *  .subscribe(() => {
     *    // Clicked 'OK', do something here...
     *  })
     * ```
     *
     * @see `openConfirmationDialog()`
     * @see `openDoubleConfirmation()`
     */
    openConfirmation(config: MatDialogConfig<ConfirmationModalConfig>): Observable<void>;

    /**
     * Extension method to open two modal dialogs in succession containing the `ConfirmationModalComponent` and asynchronously
     * return the success result. This is usually used for deletion scenarios to be sure the user wants something to
     * happen.
     *
     * @param firstConfig The dialog configuration to supply to the first dialog.
     * @param finalConfig The dialog configuration to suppy to the final dialog.
     * @returns An `Observable<void>` to subscribe to for acting when the user clicks "OK" to both dialogs.
     *
     * An observable is returned so that the actions to perform after selecting "OK" can be carried out when ready. In the case
     * when the dialog is cancelled, these actions will not be carried out.
     *
     * @example
     *
     * ```ts
     * dialog.openDoubleConfirmation(config1, config2)
     *  .subscribe(() => {
     *    // Clicked 'OK', do something here...
     *  })
     * ```
     *
     * @see `openConfirmationDialog()`
     * @see `openConfirmation()`
     */
    openDoubleConfirmation(firstConfig: MatDialogConfig<ConfirmationModalConfig>, finalConfig: MatDialogConfig<ConfirmationModalConfig>): Observable<void>;
  }
}

MatDialog.prototype.openConfirmationDialog = function (
  this: MatDialog,
  config: MatDialogConfig<ConfirmationModalConfig>): MatDialogRef<ConfirmationModalComponent, ConfirmationModalResult> {
  return this.open<ConfirmationModalComponent, ConfirmationModalConfig, ConfirmationModalResult>(
    ConfirmationModalComponent,
    config);
};

MatDialog.prototype.openConfirmation = function (
  this: MatDialog,
  config: MatDialogConfig<ConfirmationModalConfig>): Observable<void> {
  return this
    .openConfirmationDialog(config)
    .afterClosed()
    .pipe(
      filter(result => result?.status === ModalDialogStatus.Ok),
      map(() => { })
    );
};

MatDialog.prototype.openDoubleConfirmation = function (
  this: MatDialog,
  firstConfig: MatDialogConfig<ConfirmationModalConfig>,
  finalConfig: MatDialogConfig<ConfirmationModalConfig>): Observable<void> {
  return this
    .openConfirmationDialog(firstConfig)
    .afterClosed()
    .pipe(
      filter(result => result?.status === ModalDialogStatus.Ok),
      mergeMap(() => {
        return this
          .openConfirmationDialog(finalConfig)
          .afterClosed()
          .pipe(
            filter(result2 => result2?.status === ModalDialogStatus.Ok),
            map(() => { })
          );
      })
    );
};