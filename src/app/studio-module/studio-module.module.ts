import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudioModuleRoutingModule } from './studio-module-routing.module';
import { LiveStreamingComponent } from './live-streaming/live-streaming.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TodaysLessonComponent } from './todays-lesson/todays-lesson.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CKEditorModule } from 'ng2-ckeditor';
import { SearchPipe } from '../pipes/search.pipe';
import { PipesModule } from '../pipes/pipes.module';
import { PresentorManagementComponent } from './presentor-management/presentor-management.component';
import { StudioDashboardComponent } from './studio-dashboard/studio-dashboard.component';


@NgModule({
  declarations: [
    LiveStreamingComponent,
    TodaysLessonComponent,
    PresentorManagementComponent,
    StudioDashboardComponent,
  ],
  imports: [
    CommonModule,
    StudioModuleRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    CKEditorModule,
    PipesModule,
  ]
})
export class StudioModuleModule { }
