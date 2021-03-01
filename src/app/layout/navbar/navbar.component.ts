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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BroadcastEvent } from '@mdm/services/broadcast/broadcast.model';
import { BroadcastService } from '@mdm/services/broadcast/broadcast.service';
import { UserDetails } from '@mdm/services/security/security.model';
import { SecurityService } from '@mdm/services/security/security.service';
import { SharedService } from '@mdm/services/shared/shared.service';
import { ThemingService } from '@mdm/services/theming/theming.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarLink, NavbarLinkGroup } from './navbar.model';

@Component({
  selector: 'mdm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Input() linkGroups: NavbarLinkGroup[] = [];
  
  appTitle: string = 'app';
  logoUrl: string = this.theming.getAssetPath('logo.png');
  backendUrl: string = this.shared.backendUrl;
  profile: UserDetails | null = null;

  get isLoggedIn() {
    return this.profile !== undefined && this.profile !== null;
  }

  /**
   * Signal to attach to subscriptions to trigger when they should be unsubscribed.
   */
  private unsubscribe$ = new Subject();

  get mainNavbarLinks(): NavbarLink[] {
    return this.linkGroups.find(group => group.isMain)?.links ?? [];
  }

  constructor(
    private shared: SharedService,
    private security: SecurityService,
    private broadcast: BroadcastService,
    private theming: ThemingService) { }  

  ngOnInit(): void {
    this.appTitle = this.shared.appTitle;

    this.broadcast
      .on<UserDetails>(BroadcastEvent.SignedIn)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => this.profile = user);

    this.broadcast
      .on(BroadcastEvent.SignedOut)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.profile = null);

    this.profile = this.security.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  login() {
    this.broadcast.dispatch(BroadcastEvent.RequestSignIn);
  }

  logout() {
    this.broadcast.dispatch(BroadcastEvent.RequestSignOut);
  }
}
