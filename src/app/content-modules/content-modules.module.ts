import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentModulesRoutingModule } from './content-modules-routing.module';
import { MultimediaVideosComponent } from './multimedia-videos/multimedia-videos.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EBookComponent } from './e-book/e-book.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuickRecapComponent } from './quick-recap/quick-recap.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { HomeworkComponent } from './homework/homework.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CertificateComponent } from './certificate/certificate.component';
import { PlanVideosComponent } from './plan-videos/plan-videos.component';
import { PipesModule } from '../pipes/pipes.module';
import { LectureVideosComponent } from './lecture-videos/lecture-videos.component';
import { BulkQuizComponent } from './bulk-quiz/bulk-quiz.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';


@NgModule({
  declarations: [
    MultimediaVideosComponent,
    EBookComponent,
    QuizComponent,
    QuickRecapComponent,
    HomeworkComponent,
    CertificateComponent,
    PlanVideosComponent,
    LectureVideosComponent,
    BulkQuizComponent,
    CaseStudiesComponent,
    
  ],
  imports: [
    CommonModule,
    ContentModulesRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    CKEditorModule,
    PipesModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
})
export class ContentModulesModule { }
