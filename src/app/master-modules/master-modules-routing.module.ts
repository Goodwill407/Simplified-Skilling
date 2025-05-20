import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectMasterComponent } from './subject-master/subject-master.component';
import { ClassMasterComponent } from './class-master/class-master.component';
import { BoardMasterComponent } from './board-master/board-master.component';
import { ChapterMasterComponent } from './chapter-master/chapter-master.component';
import { BoardcastComponent } from './boardcast/boardcast.component'
import { BookMasterComponent } from './book-master/book-master.component';
import { MediumMasterComponent } from './medium-master/medium-master.component';
import { LessonMasterComponent } from './lesson-master/lesson-master.component';
import { MappingComponent } from './mapping/mapping.component';
import { SearchByPinComponent } from './search-by-pin/search-by-pin.component';
import { AddRoleComponent } from './add-role/add-role.component';

const routes: Routes = [
  { path: 'subject-master', component: SubjectMasterComponent },
  { path: 'class-master', component: ClassMasterComponent },
  { path: 'board-master', component: BoardMasterComponent },
  { path: 'chapter-master', component: ChapterMasterComponent },
  { path: 'boardcast', component: BoardcastComponent },
  { path: 'book-master', component: BookMasterComponent },
  { path: 'medium-master', component: MediumMasterComponent },
  { path: 'lesson-master', component: LessonMasterComponent },
  { path: 'mapping', component: MappingComponent },
  { path: 'pincode', component: SearchByPinComponent },
  { path: 'add-role', component: AddRoleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterModulesRoutingModule { }
