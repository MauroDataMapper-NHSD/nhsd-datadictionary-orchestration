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

import { Component, Input, OnInit } from '@angular/core';
import { UserDetails } from '@mdm/models/users';
import { BroadcastEvent } from '@mdm/services/broadcast/broadcast.model';
import { BroadcastService } from '@mdm/services/broadcast/broadcast.service';
import { SharedService } from '@mdm/services/shared.service';
import { ThemingService } from '@mdm/services/theming.service';
import { NavbarLink, NavbarLinkGroup } from './navbar.model';

@Component({
  selector: 'mdm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() linkGroups: NavbarLinkGroup[] = [];
  
  appTitle: string = 'app';
  logoUrl: string = this.theming.getAssetPath('logo.png');
  backendUrl: string = this.shared.backendUrl;
  isLoggedIn: boolean = false;
  profile!: UserDetails;

  get mainNavbarLinks(): NavbarLink[] {
    return this.linkGroups.find(group => group.isMain)?.links ?? [];
  }

  constructor(
    private shared: SharedService,
    private broadcast: BroadcastService,
    private theming: ThemingService) { }

  ngOnInit(): void {
    this.appTitle = this.shared.appTitle;

    this.profile = {
      id: 'f3baa035-8743-449a-9455-5bf7cc7b0af5',
      firstName: 'Peter',
      lastName: 'Monks',
      userName: 'test',
      isAdmin: true
    };
  }

  login() {
    this.broadcast.dispatch(BroadcastEvent.UserRequestsSignIn);
  }

  logout() {    
  }
}
