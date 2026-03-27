import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginDialog } from './dialog/login-dialog/login-dialog';
import { RegisterDialog } from './dialog/register-dialog/register-dialog';
import { AreaUtente } from './components/area-utente/area-utente';
import { authAutentificatedGuard } from './auth/auth-guard';

const routes: Routes = [
  {path:'utente', component:AreaUtente, canActivate:[authAutentificatedGuard]},
  {path:'login', component: LoginDialog},
  {path:'registra', component: RegisterDialog}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }