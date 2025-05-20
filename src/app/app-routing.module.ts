import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSkeletonComponent } from './admin-skeleton/admin-skeleton.component';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./login-module/login-module.module').then(m => m.LoginModuleModule) },
  {
    path: 'dashboard',
    component: AdminSkeletonComponent,
    children: [
      { path: '', loadChildren: () => import('./master-modules/master-modules.module').then(m => m.MasterModulesModule), canActivate: [RoleGuard], data: { expectedRole: 'superadmin' } },
      { path: '', loadChildren: () => import('./content-modules/content-modules.module').then(m => m.ContentModulesModule), canActivate: [RoleGuard], data: { expectedRole: 'superadmin' } },
      { path: '', loadChildren: () => import('./admin-skeleton/admin-skeleton.module').then(m => m.AdminSkeletonModule) },
      { path: '', loadChildren: () => import('./studio-module/studio-module.module').then(m => m.StudioModuleModule), canActivate: [RoleGuard], data: { expectedRole: 'studio' } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
