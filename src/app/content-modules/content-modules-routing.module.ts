import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultimediaVideosComponent } from './multimedia-videos/multimedia-videos.component';
import { EBookComponent } from './e-book/e-book.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuickRecapComponent } from './quick-recap/quick-recap.component';
import { HomeworkComponent } from './homework/homework.component';
import { CertificateComponent } from './certificate/certificate.component';
import { PlanVideosComponent } from './plan-videos/plan-videos.component';
import { LectureVideosComponent } from './lecture-videos/lecture-videos.component';
import { BulkQuizComponent } from './bulk-quiz/bulk-quiz.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';

const routes: Routes = [
  { path: 'e-Book', component: EBookComponent },
  { path: 'videos', component: MultimediaVideosComponent },
  { path: 'Lecture', component: LectureVideosComponent },
  { path: 'plan-videos', component: PlanVideosComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'bulkquiz', component: BulkQuizComponent },
  { path: 'quick-recap', component: QuickRecapComponent },
  { path: 'homework', component: HomeworkComponent },
  { path: 'certificate', component: CertificateComponent },
  { path: 'case-studies', component: CaseStudiesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentModulesRoutingModule { }
