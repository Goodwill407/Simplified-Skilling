import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSkeletonRoutingModule } from './admin-skeleton-routing.module';
import { AdminSkeletonNavbarComponent } from './admin-skeleton-navbar/admin-skeleton-navbar.component';
import { AdminSkeletonBodyComponent } from './admin-skeleton-body/admin-skeleton-body.component';
import { AdminSkeletonSidebarComponent } from './admin-skeleton-sidebar/admin-skeleton-sidebar.component';
import { AdminSkeletonComponent } from './admin-skeleton.component';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';



@NgModule({
  declarations: [
    AdminSkeletonComponent,
    AdminSkeletonSidebarComponent,
    AdminSkeletonNavbarComponent,
    AdminSkeletonBodyComponent,
    SuperadminDashboardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AdminSkeletonRoutingModule
  ]
})
export class AdminSkeletonModule { }
