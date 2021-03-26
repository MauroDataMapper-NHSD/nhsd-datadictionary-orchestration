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

export { }

declare global {
  interface Array<T> {
    groupBy<T, K extends keyof any>(keySelector: (item: T) => K): Record<K, T[]>;
  }
}

Array.prototype.groupBy = function <T, K extends keyof any>(this: Array<T>, keySelector: (item: T) => K): Record<K, T[]> {
  return this.reduce(
    (previous, currentItem) => {
      const group = keySelector(currentItem);
      if (!previous[group]) {
        previous[group] = [];
      }
      previous[group].push(currentItem);
      return previous;
    }, 
    { } as Record<K, T[]>);
}