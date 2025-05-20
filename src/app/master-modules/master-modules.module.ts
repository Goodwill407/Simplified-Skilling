import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectMasterComponent } from './subject-master/subject-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterModulesRoutingModule } from './master-modules-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ClassMasterComponent } from './class-master/class-master.component'
import { BoardMasterComponent } from './board-master/board-master.component';
import { ChapterMasterComponent } from './chapter-master/chapter-master.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BoardcastComponent } from './boardcast/boardcast.component';
import { BookMasterComponent } from './book-master/book-master.component';
import { MediumMasterComponent } from './medium-master/medium-master.component';
import { SearchPipe } from '../pipes/search.pipe';
import { LessonMasterComponent } from './lesson-master/lesson-master.component';
import { MappingComponent } from './mapping/mapping.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SearchByPinComponent } from './search-by-pin/search-by-pin.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { PipesModule } from '../pipes/pipes.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    BoardMasterComponent,
    ChapterMasterComponent,
    SubjectMasterComponent,
    ClassMasterComponent,
    BoardcastComponent,
    BookMasterComponent,
    MediumMasterComponent,
    LessonMasterComponent,
    MappingComponent,
    SearchByPinComponent,
    AddRoleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MasterModulesRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    PipesModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
})
export class MasterModulesModule { }
