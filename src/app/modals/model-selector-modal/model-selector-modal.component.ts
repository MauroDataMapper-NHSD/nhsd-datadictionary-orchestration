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

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataDictionaryModel } from '@mdm/core/dashboard/dashboard.model';
import { ModalDialogStatus } from '../modal.model';
import { ModelSelectorModalResult } from './model-selector-modal.model';

@Component({
  selector: 'mdm-model-selector-modal',
  templateUrl: './model-selector-modal.component.html',
  styleUrls: ['./model-selector-modal.component.scss']
})
export class ModelSelectorModalComponent implements OnInit {

  selected?: DataDictionaryModel;

  get isSelected() {
    return !!this.selected;
  }

  constructor(private dialogRef: MatDialogRef<ModelSelectorModalComponent, ModelSelectorModalResult>) { }

  ngOnInit(): void {
  }

  modelSelected(model: DataDictionaryModel) {
    this.selected = model;
  }

  cancel() {
    this.dialogRef.close({ status: ModalDialogStatus.Cancel });
  }

  ok() {
    this.dialogRef.close({ status: ModalDialogStatus.Ok, model: this.selected });
  }

}
