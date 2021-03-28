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

import { Type } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockComponent } from "ng-mocks";
import { NgxSkeletonLoaderComponent } from "ngx-skeleton-loader";
import { TestingModule } from "./testing.module";

export interface TestModuleConfiguration {
  declarations?: any[];
  imports?: any[];
  providers?: any[];
}

export function setupTestModuleForService<T>(service: Type<T>, configuration?: TestModuleConfiguration): T {
  TestBed.configureTestingModule({
    imports: [TestingModule, ...configuration?.imports ?? []],
    providers: configuration?.providers ?? []
  });
  return TestBed.inject(service);
}

export async function setupTestModuleForComponent<T>(componentType: Type<T>, configuration?: TestModuleConfiguration) {
  await TestBed
    .configureTestingModule({
      imports: [TestingModule, ...configuration?.imports ?? []],
      declarations: [
        componentType, 
        MockComponent(NgxSkeletonLoaderComponent),
        ...configuration?.declarations ?? []],
      providers: configuration?.providers ?? []
    })
    .compileComponents();

  const fixture = TestBed.createComponent(componentType);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  return new ComponentHarness(component, fixture);
}

export class ComponentHarness<T> {
  constructor(public component: T, public fixture: ComponentFixture<T>) { }

  get isComponentCreated() {
    return !!this.component;
  }

  detectChanges() {
    this.fixture.detectChanges();
  }
}