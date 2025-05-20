import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveStreamingComponent } from './live-streaming/live-streaming.component';
import { TodaysLessonComponent } from './todays-lesson/todays-lesson.component';
import { PresentorManagementComponent } from './presentor-management/presentor-management.component';
import { StudioDashboardComponent } from './studio-dashboard/studio-dashboard.component';

const routes: Routes = [
  { path: 'live-streaming', component: LiveStreamingComponent },
  { path: 'todays-lesson', component: TodaysLessonComponent },
  { path: 'presenter-management', component: PresentorManagementComponent },
  { path: 'studio-dashboard', component: StudioDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudioModuleRoutingModule { }
