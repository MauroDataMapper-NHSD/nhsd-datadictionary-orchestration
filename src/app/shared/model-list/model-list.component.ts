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

import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { DataDictionaryModel } from '@mdm/core/dashboard/dashboard.model';
import { DashboardService } from '@mdm/core/dashboard/dashboard.service';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mdm-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() selectedModel = new EventEmitter<DataDictionaryModel>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  dataSource: DataDictionaryModel[] = [];
  displayModels: DataDictionaryModel[] = [];
  loading = false;

  /**
   * Signal to attach to subscriptions to trigger when they should be unsubscribed.
   */
  private unsubscribe$ = new Subject();

  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    this.loadModels();
  }

  ngAfterViewInit(): void {
    this.setupSearchFilter();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  modelSelected(changes: MatSelectionListChange) {
    if (changes.options && changes.options.length > 0) {
      const option = changes.options[0];
      this.selectedModel.emit(option.value);
    }
  }

  refresh() {
    this.searchInput.nativeElement.value = '';
    this.loadModels();
  }

  private loadModels() {
    this.loading = true;
    this.dashboard
      .getModels()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(models => {
        this.dataSource = models;
        this.displayModels = this.applyDataSource(this.dataSource);
      });
  }

  private setupSearchFilter() {    
    fromEvent<any>(this.searchInput.nativeElement, 'input')
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(200),
        distinctUntilChanged(),
        map(event => event.target.value),
        map(query => this.applyDataSource(this.dataSource, query))
      )
      .subscribe(models => this.displayModels = models);
  }

  private applyDataSource(source: DataDictionaryModel[], query?: string) {
    return this
      .filterModels(source, query)
      .sort((first, second) => first.compareTo(second));
  }

  private filterModels(source: DataDictionaryModel[], query?: string) {
    if (!query || query.length === 0) {
      return source;
    }

    return source.filter(model => model.label.toLowerCase().includes(query.toLowerCase()));
  }
}
