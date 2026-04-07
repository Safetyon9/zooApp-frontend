import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Ecommerce } from './features/public/ecommerce/ecommerce';
import { PublicLayout } from './features/public/public-layout/public-layout';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { Dashboard } from './features/user/dashboard/dashboard';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { authAutentificatedGuard } from './core/guards/auth-guard';
import { LoginDialog } from './features/auth/dialog/login-dialog/login-dialog';
import { RegisterDialog } from './features/auth/dialog/register-dialog/register-dialog';
import { UserLayout } from './features/user/user-layout/user-layout';
import { Info } from './features/user/info/info';

const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'shop', component: Ecommerce },
    ]
  },

  {
    path: 'utente',
    component: UserLayout,
    canActivate: [authAutentificatedGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'info', component: Info }
    ]
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authAutentificatedGuard],
    children: [
      { path: '', component: AdminDashboard },
    ]
  },

  { path: 'login', component: LoginDialog },
  { path: 'register', component: RegisterDialog },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }