import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './sanstha-registration/sanstha-registration.component';
import { SchoolRegistrationComponent } from './school-registration/school-registration.component';
import { SchoolLoginComponent } from './school-login/school-login.component';
import { StudentLoginComponent } from './student-login/student-login.component';

const routes: Routes = [
  // { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'school-login', component: SchoolLoginComponent },
  { path: 'student-login', component: StudentLoginComponent },
  { path: 'sansthan-registration', component: RegistrationComponent },
  { path: 'password-process', component: SchoolRegistrationComponent },
  {path: '', component: SchoolLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginModuleRoutingModule { }
