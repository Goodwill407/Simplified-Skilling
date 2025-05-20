import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginModuleRoutingModule } from './login-module-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegistrationComponent } from './sanstha-registration/sanstha-registration.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SchoolRegistrationComponent } from './school-registration/school-registration.component';
import { SchoolLoginComponent } from './school-login/school-login.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    LandingPageComponent,
    RegistrationComponent,
    SchoolRegistrationComponent,
    SchoolLoginComponent,
    StudentLoginComponent
  ],
  imports: [
    CommonModule,
    LoginModuleRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule
  ]
})
export class LoginModuleModule { }
