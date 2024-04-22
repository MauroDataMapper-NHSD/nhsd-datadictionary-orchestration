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

import { SignInCredentials, UserDetails } from './security.model';
import { cold } from 'jest-marbles';

import { SecurityService } from './security.service';
import { EMPTY } from 'rxjs';
import { MdmResourcesService } from '@mdm/mdm-resources/mdm-resources/mdm-resources.service';
import { setupTestModuleForService } from '@mdm/testing/testing.helpers';

interface MdmSecurityResourceStub {
  login: jest.Mock;
  logout: jest.Mock;
}

interface MdmSessionResourceStub {
  isApplicationAdministration: jest.Mock;
  isAuthenticated: jest.Mock;
}

interface MdmResourcesServiceStub {
  security: MdmSecurityResourceStub;
  session: MdmSessionResourceStub;
}

describe('SecurityService', () => {
  let service: SecurityService;
  const resourcesStub: MdmResourcesServiceStub = {
    security: {
      login: jest.fn(),
      logout: jest.fn()
    },
    session: {
      isApplicationAdministration: jest.fn(),
      isAuthenticated: jest.fn()
    }
  };

  beforeEach(() => {
    service = setupTestModuleForService(SecurityService, {
      providers: [
        {
          provide: MdmResourcesService,
          useValue: resourcesStub
        }
      ]
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each([
    ['123', 'user@test.com', false],
    ['456', 'admin@test.com', true]
  ])('should sign in user %s %s when admin = %o', (id, userName, isAdmin) => {
    const credentials: SignInCredentials = { username: userName, password: 'test' };
    const expectedUser: UserDetails = {
      id,
      userName,
      firstName: 'first',
      lastName: 'last',
      isAdmin,
      needsToResetPassword: false,
      role: '',
      token: undefined
    };

    resourcesStub.security.login.mockImplementationOnce(() =>
      cold('--a|', {
        a: {
          body: {
            id: expectedUser.id,
            emailAddress: expectedUser.userName,
            firstName: expectedUser.firstName,
            lastName: expectedUser.lastName
          }
        }
      })
    );

    resourcesStub.session.isApplicationAdministration.mockImplementationOnce(() =>
      cold('--a|', {
        a: {
          body: {
            applicationAdministrationSession: expectedUser.isAdmin
          }
        }
      })
    );

    const expected$ = cold('----a|', { a: expectedUser });
    const actual$ = service.signIn(credentials);

    expect(actual$).toBeObservable(expected$);
  });

  // TODO: figure out why this fails
  // it('should throw error if sign in fails', () => {
  //   resourcesStub.security.login.mockImplementationOnce(() => cold('--#', null, new HttpErrorResponse({})));

  //   const expected$ = cold('--#');
  //   const actual$ = service.signIn({ username: 'fail', password: 'fail' });
  //   expect(actual$).toBeObservable(expected$);
  // });

  it('should sign out user', () => {
    resourcesStub.security.logout.mockImplementationOnce(() =>
      cold('--a|', { a: EMPTY })
    );

    const expected$ = cold('--a|', { a: undefined });
    const actual$ = service.signOut();
    expect(actual$).toBeObservable(expected$);
  });

  // TODO: figure out why this fails
  // it('should throw error if sign out fails', () => {
  //   resourcesStub.security.logout.mockImplementationOnce(() => cold('--#', null, new HttpErrorResponse({})));

  //   const expected$ = cold('--#');
  //   const actual$ = service.signOut();
  //   expect(actual$).toBeObservable(expected$);
  // });

  it.each([true, false])(
    'should return %o for an authenticated session',
    (authenticated) => {
      resourcesStub.session.isAuthenticated.mockImplementationOnce(() =>
        cold('--a|', {
          a: {
            body: {
              authenticatedSession: authenticated
            }
          }
        })
      );

      const expected$ = cold('--a|', { a: authenticated });
      const actual$ = service.isAuthenticated();
      expect(actual$).toBeObservable(expected$);
    }
  );

  // TODO: figure out why this fails
  // it('should throw error if authentication fails', () => {
  //   resourcesStub.session.isAuthenticated.mockImplementationOnce(() => cold('--#', null, new HttpErrorResponse({})));

  //   const expected$ = cold('--#');
  //   const actual$ = service.isAuthenticated();
  //   expect(actual$).toBeObservable(expected$);
  // });
});
