import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSkeletonComponent } from './admin-skeleton.component';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';

const routes: Routes = [
  { path: 'superadmin-dashboard', component: SuperadminDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSkeletonRoutingModule { }
