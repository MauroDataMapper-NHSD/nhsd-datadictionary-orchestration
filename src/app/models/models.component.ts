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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { BroadcastEvent } from '@mdm/services/broadcast/broadcast.model';
import { BroadcastService } from '@mdm/services/broadcast/broadcast.service';
import { DataDictionaryModel } from '@mdm/services/dashboard/dashboard.model';
import { SharedService } from '@mdm/services/shared/shared.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mdm-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit, OnDestroy {

  selectedModel?: DataDictionaryModel;

  /**
   * Signal to attach to subscriptions to trigger when they should be unsubscribed.
   */
  private unsubscribe$ = new Subject();

  constructor(
    private shared: SharedService,
    private broadcast: BroadcastService) { }  

  ngOnInit(): void {
    this.selectedModel = this.shared.currentModel;

    this.broadcast
      .on<DataDictionaryModel>(BroadcastEvent.ModelChanged)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(model => this.selectedModel = model);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
