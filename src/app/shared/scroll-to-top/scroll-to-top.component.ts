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
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mdm-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit, OnDestroy {

  hasScrolled = false;

  /**
   * Signal to attach to subscriptions to trigger when they should be unsubscribed.
   */
  private unsubscribe$ = new Subject();

  ngOnInit(): void {
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.onWindowScroll());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.hasScrolled = true;
    }
    else if (this.hasScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.hasScrolled = false;
    }
  }

  scrollToTop() {
    (function smoothScroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothScroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }

}
