/*
Copyright 2021-2024 NHS England

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
*/

import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NavbarLinkGroup } from './layout/navbar/navbar.model';
import { SignInModalComponent } from './dialogs/sign-in-dialog/sign-in-dialog.component';
import { BroadcastEvent } from './core/broadcast/broadcast.model';
import { BroadcastService } from './core/broadcast/broadcast.service';
import { MdmResourcesError } from './mdm-resources/mdm-resources/mdm-resources.model';
import { SecurityService } from './core/security/security.service';
import { SharedService } from './core/shared/shared.service';
import {
  CommonUiStates,
  StateHandlerService
} from './core/state-handler/state-handler.service';
import { ThemingService } from './core/theming/theming.service';
import { UserIdleService } from './external/user-idle/user-idle.service';
import { UserDetails } from './core/security/security.model';
import { FeaturesService } from './core/features/features.service';

@Component({
  selector: 'mdm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'nhsd-datadictionary-orchestration';
  themeCssSelector = '';

  navbarLinks: NavbarLinkGroup[] = [
    {
      label: 'Main navigation',
      isMain: true,
      links: [
        {
          label: 'Home',
          uiSref: 'app.container.home',
          icon: 'fa-home'
        },
        {
          label: 'Branches',
          uiSref: 'app.container.branches.default',
          icon: 'fa-code-branch',
          onlySignedIn: true
        },
        {
          label: 'Preview',
          uiSref: 'app.container.preview.default',
          icon: 'fa-book-reader',
          onlySignedIn: true
        },
        {
          label: 'Changes',
          uiSref: 'app.container.changes.default',
          icon: 'fa-book-reader',
          onlySignedIn: true
        },
        {
          label: 'About',
          uiSref: 'app.container.about',
          icon: 'fa-info-circle'
        }
      ]
    }
  ];

  /**
   * Signal to attach to subscriptions to trigger when they should be unsubscribed.
   */
  private unsubscribe$ = new Subject<void>();

  constructor(
    private shared: SharedService,
    private broadcast: BroadcastService,
    private stateHandler: StateHandlerService,
    private security: SecurityService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private theming: ThemingService,
    private overlayContainer: OverlayContainer,
    private userIdle: UserIdleService,
    private features: FeaturesService
  ) {}

  @HostListener('window:mousemove', ['$event'])
  onMouseMove() {
    this.userIdle.resetTimer();
  }

  ngOnInit(): void {
    this.setTheme();

    if (this.features.useOpenIdConnect) {
      // This is a startup test. Loading features may require a server endpoint request to complete, so start it
      // here before the sign-in-dialog is opened so the user doesn't notice any delay
      console.log('OpenID Connect allowed');
    }

    this.broadcast
      .on(BroadcastEvent.ApplicationOffline)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.toastr.warning('Application is offline!'));

    this.broadcast
      .on(BroadcastEvent.RequestSignIn)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.signIn());

    this.broadcast
      .on(BroadcastEvent.RequestSignOut)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.signOut());

    this.subscribeHttpErrorEvent(
      BroadcastEvent.NotAuthorized,
      'app.container.notAuthorized'
    );
    this.subscribeHttpErrorEvent(BroadcastEvent.NotFound, 'app.container.notFound');
    this.subscribeHttpErrorEvent(
      BroadcastEvent.NotImplemented,
      'app.container.notImplemented'
    );
    this.subscribeHttpErrorEvent(BroadcastEvent.ServerError, 'app.container.serverError');

    // Check immediately if the last authenticated session is expired and setup a recurring
    // check for this
    this.shared.checkSessionExpiry();
    this.setupIdleTimer();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private setTheme() {
    this.themeCssSelector = this.theming.themeCssSelector;

    // Material theme is wrapped inside a CSS class but the overlay container is not part of Angular
    // Material. Have to manually set the correct theme class to this container too
    this.overlayContainer.getContainerElement().classList.add(this.themeCssSelector);
    this.overlayContainer.getContainerElement().classList.add('overlay-container');
  }

  private subscribeHttpErrorEvent(event: BroadcastEvent, state: string) {
    this.broadcast
      .on<HttpErrorResponse>(event)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => this.handleHttpError(response, state));
  }

  private handleHttpError(response: HttpErrorResponse, state: string) {
    this.shared.lastHttpError = response;
    this.stateHandler.go(state);
  }

  private signIn() {
    this.dialog
      .open<SignInModalComponent, any, UserDetails>(SignInModalComponent)
      .afterClosed()
      .subscribe((user) => {
        if (user) {
          this.broadcast.dispatch(BroadcastEvent.SignedIn, user);
          this.toastr.clear();
          this.stateHandler.goTo(
            CommonUiStates.Branches,
            {},
            { reload: true, inherit: false }
          );
        }
      });
  }

  private signOut() {
    this.security
      .signOut()
      .pipe(
        finalize(() => {
          this.broadcast.dispatch(BroadcastEvent.SignedOut);
          this.stateHandler.goTo(CommonUiStates.Default);
        })
      )
      .subscribe(
        () => {},
        (error: MdmResourcesError) =>
          console.error(
            `There was a problem signing out: ${error.response.status} ${error.response.message}`
          )
      );
  }

  private setupIdleTimer() {
    this.userIdle.startWatching();
    this.userIdle
      .onTimerStart()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {});

    let lastCheck = new Date();
    this.userIdle
      .onTimeout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const now = new Date();

        if (now.valueOf() - lastCheck.valueOf() > this.shared.checkSessionExpiryTimeout) {
          this.shared.checkSessionExpiry();
          this.userIdle.resetTimer();
        }

        lastCheck = now;
      });
  }
}
