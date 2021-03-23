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

import { TestBed } from '@angular/core/testing';
import { TestingModule } from '@mdm/testing/testing.module';
import { cold } from 'jest-marbles';
import { BroadcastEvent } from './broadcast.model';

import { BroadcastService } from './broadcast.service';

describe('BroadcastService', () => {
  let service: BroadcastService;  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });
    service = TestBed.inject(BroadcastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });    

  const getBroadcastEvents = (): BroadcastEvent[] => {
    return Object
      .keys(BroadcastEvent)
      .filter(value => !isNaN(Number(value)))
      .map((key: any) => (<unknown>BroadcastEvent[key]) as BroadcastEvent);
  };

  it.each(getBroadcastEvents())('should dispatch events when %o is broadcast', (event) => {
    const payload = 42;

    cold('-a').subscribe(() => service.dispatch(event, payload));

    const expected$ = cold('-a', { a: payload });
    const actual$ = service.on(event);

    expect(actual$).toBeObservable(expected$);
  })
});