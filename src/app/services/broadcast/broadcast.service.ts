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

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BroadcastEvent, BroadcastMessage } from './broadcast.model';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private handler = new Subject<BroadcastMessage<any>>();

  on<T = any>(event: BroadcastEvent): Observable<T> {
    return this.handler.pipe(
      filter(message => message.event === event),
      map(message => message.payload)
    );
  }

  dispatch<T = any>(event: BroadcastEvent, payload?: T) {
    this.handler.next(new BroadcastMessage(event, payload));
  }  
}
