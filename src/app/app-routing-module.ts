import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginDialog } from './dialog/login-dialog/login-dialog';
import { RegisterDialog } from './dialog/register-dialog/register-dialog';
import { AreaUtente } from './components/area-utente/area-utente';
import { authAutentificatedGuard } from './auth/auth-guard';
import { Home } from './components/home/home';
import { Profilo } from './components/profilo/profilo';
import { AreaAdmin } from './components/area-admin/area-admin';

const routes: Routes = [
  {path:'', component: Home},
  {path:'utente', component:AreaUtente, canActivate:[authAutentificatedGuard], children:[
    { path: '', redirectTo: 'profilo', pathMatch: 'full' },
    {path:'profilo', component:Profilo}
  ]},
  {path:'admin', component: AreaAdmin},
  {path:'login', component: LoginDialog},
  {path:'registra', component: RegisterDialog}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }