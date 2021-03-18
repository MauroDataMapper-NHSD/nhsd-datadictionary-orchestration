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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@mdm/testing/testing.module';
import { SharedService } from '@mdm/core/shared/shared.service';

import { UserComponent } from './user.component';

interface SharedServiceStub {
  backendUrl: string;
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  const sharedStub: SharedServiceStub = {
    backendUrl: 'http://test.com'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        {
          provide: SharedService,
          useValue: sharedStub
        }
      ],
      declarations: [ UserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    component.user = { id: '123', firstName: 'test', lastName: 'test', userName: 'test' };
    fixture.detectChanges();
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });

  it.each(['1', '2', '3'])('should set the correct image URL for user %s', (id) => {
    component.user = {
      id: id,
      firstName: 'test',
      lastName: 'test',
      userName: 'test'
    };

    fixture.detectChanges();
    component.ngOnInit();

    const expected = `${sharedStub.backendUrl}/catalogueUsers/${id}/image`;
    expect(component.imageUrl).toBe(expected);
  })
});
