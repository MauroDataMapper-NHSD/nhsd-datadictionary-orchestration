import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '@nhsd/home/home.component';
import { AboutComponent } from '@nhsd/about/about.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HomeComponent,
    AboutComponent
  ]
})
export class DashboardModule { }
