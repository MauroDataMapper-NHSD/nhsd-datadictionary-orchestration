import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { states } from './routing/ui-states';
import { UIRouterModule } from '@uirouter/angular';
import { AppContainerComponent } from './app-container/app-container.component';
import { UiViewComponent } from './shared/ui-view/ui-view.component';

@NgModule({
  declarations: [
    AppComponent,
    AppContainerComponent,
    UiViewComponent
  ],
  imports: [
    BrowserModule,        
    DashboardModule,
    UIRouterModule.forRoot({ states: states, useHash: true })
  ],
  bootstrap: [UiViewComponent]
})
export class AppModule { }
