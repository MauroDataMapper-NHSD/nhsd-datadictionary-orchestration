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
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogStatus } from '@mdm/modals/modal.model';
import { ModelSelectorModalComponent } from '@mdm/modals/model-selector-modal/model-selector-modal.component';
import { ModelSelectorModalConfig, ModelSelectorModalResult } from '@mdm/modals/model-selector-modal/model-selector-modal.model';
import { BroadcastEvent } from '@mdm/core/broadcast/broadcast.model';
import { BroadcastService } from '@mdm/core/broadcast/broadcast.service';
import { DataDictionaryModel } from '@mdm/core/dashboard/dashboard.model';
import { SharedService } from '@mdm/core/shared/shared.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'mdm-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrls: ['./model-selector.component.scss']
})
export class ModelSelectorComponent implements OnInit {

  selected?: DataDictionaryModel;

  constructor(
    private dialog: MatDialog,
    private shared: SharedService,
    private broadcast: BroadcastService) { }

  ngOnInit(): void {
    this.selected = this.shared.currentModel;
  }

  selectModel() {
    this.dialog
      .open<ModelSelectorModalComponent, ModelSelectorModalConfig, ModelSelectorModalResult>(ModelSelectorModalComponent, { })
      .afterClosed()
      .pipe(
        filter(result => result?.status === ModalDialogStatus.Ok)
      )
      .subscribe(result => {
        this.selected = result?.model;
        this.broadcast.dispatch(BroadcastEvent.ModelChanged, this.selected);
      })
  }

}
