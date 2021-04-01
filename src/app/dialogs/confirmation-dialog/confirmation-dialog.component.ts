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

import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogResult, DialogStatus } from '../dialogs.model';
import { ConfirmationDialogOptions } from './confirmation-dialog.model';

@Component({
  selector: 'mdm-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  title?: string;
  message = '';
  okTitle = '';
  cancelTitle = '';
  showCancel = false;
  btnType: ThemePalette = 'primary';

  constructor(
    private dialogRef: MatDialogRef<ConfirmationModalComponent, DialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogOptions
  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;

    this.okTitle = this.data.okBtnTitle ? this.data.okBtnTitle : 'OK';
    this.btnType = this.data.btnType ? this.data.btnType : 'primary';
    this.cancelTitle = this.data.cancelBtnTitle ? this.data.cancelBtnTitle : 'Cancel';
    this.title = this.data.title;
    this.message = this.data.message;
    this.showCancel = this.data.showCancel != null ? this.data.showCancel : true;
  }

  ok() {
    return this.dialogRef.close({ status: DialogStatus.Ok });
  }

  cancel() {
    return this.dialogRef.close({ status: DialogStatus.Cancel });
  }
}
