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
import { UserDetails } from '@mdm/services/security/security.model';
import { SharedService } from '@mdm/services/shared/shared.service';

export type UserComponentLayoutMode = 'column' | 'row';

@Component({
  selector: 'mdm-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input() user: UserDetails | null = null;
  @Input() layout: UserComponentLayoutMode = 'column';

  imageUrl: string = '';

  constructor(private shared: SharedService) { }

  ngOnInit(): void {
    if (this.user) {
      this.imageUrl = `${this.shared.backendUrl}/catalogueUsers/${this.user.id}/image`;
    }
  }
}
