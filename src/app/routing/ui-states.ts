import { Ng2StateDeclaration } from '@uirouter/angular';
import { AppComponent } from '@nhsd/app.component';
import { HomeComponent } from '@nhsd/home/home.component';
import { AppContainerComponent } from '@nhsd/app-container/app-container.component';
import { AboutComponent } from '@nhsd/about/about.component';

export const states: Ng2StateDeclaration[] = [
  {
    name: 'app',
    component: AppComponent
  },   
  {
    name: 'app.container',
    component: AppContainerComponent
  },
  {
    name: 'app.container.default',        
    url: '',
    component: HomeComponent
  },
  {
    name: 'app.container.home',
    url: '/home',
    component: HomeComponent
  },
  {
    name: 'app.container.about',
    url: '/about',
    component: AboutComponent
  }
];
