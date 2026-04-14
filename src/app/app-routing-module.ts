import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Ecommerce } from './features/public/ecommerce/ecommerce';
import { PublicLayout } from './features/public/public-layout/public-layout';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { authAutentificatedGuard } from './core/guards/auth-guard';
import { LoginDialog } from './features/auth/dialog/login-dialog/login-dialog';
import { RegisterDialog } from './features/auth/dialog/register-dialog/register-dialog';
import { UserLayout } from './features/user/user-layout/user-layout';
import { Info } from './features/user/info/info';
import { ChangePwd } from './features/user/change-pwd/change-pwd';
import { GestioneItems } from './features/admin/gestione-items/gestione-items';
import { GestioneUtente } from './features/admin/gestione-utenti/gestione-utenti';
import { GestioneEventi } from './features/admin/gestione-eventi/gestione-eventi';
import { GestioneOrdini } from './features/admin/gestione-ordini/gestione-ordini';
import { ProdottiManager } from './features/admin/gestione-items/prodotti-manager/prodotti-manager';
import { BigliettiManager } from './features/admin/gestione-items/biglietti-manager/biglietti-manager';
import { ShopBiglietti } from './features/public/ecommerce/section/shop-biglietti/shop-biglietti';
import { ShopMerch } from './features/public/ecommerce/section/shop-merch/shop-merch';
import { UpdateDialog } from './features/auth/dialog/update-dialog/update-dialog';
import { Ordini } from './features/user/ordini/ordini';
import { Shop } from './features/public/ecommerce/section/shop/shop';
import { AdminChangePwd } from './features/admin/admin-change-pwd/admin-change-pwd';
import { Carrello } from './features/public/carrello/carrello';
import { EmailValidation } from './features/public/email/email-validation/email-validation';
import { PasswordDimenticataComponent } from './features/public/email/password-dimenticata/password-dimenticata';
import { ResetPasswordComponent } from './features/public/email/change-password/change-password';
import { Checkout } from './features/public/checkout/checkout';
import { GestioneCoupons } from './features/admin/gestione-coupons/gestione-coupons';
import { CouponDialog } from './features/admin/gestione-coupons/coupons-dialog/coupons-dialog';
import { GestioneGiornate } from './features/admin/gestione-giornate/gestione-giornate';
import { OrdineDettaglio } from './features/auth/dialog/ordine-dettaglio/ordine-dettaglio';

const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      {
        path: 'shop',
        component: Ecommerce,
        children: [
          { path: '', component: Shop },
          { path: 'biglietti', component: ShopBiglietti },
          { path: 'merch', component: ShopMerch },
        ]
      },
    ]
  },

  {
    path: 'utente',
    component: UserLayout,
    canActivate: [authAutentificatedGuard],
    children: [
      { path: '', component: Info },
      { path: 'modify', component: ChangePwd },
      { path: 'ordini', component: Ordini }
    ]
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authAutentificatedGuard],
    children: [
      { path: '', component: GestioneUtente },
      { path: 'utenti', component: GestioneUtente },
      { path: 'items', component: GestioneItems },
      { path: 'items/prodotti', component: ProdottiManager },
      { path: 'items/biglietti', component: BigliettiManager },
      { path: 'eventi', component: GestioneEventi },
      { path: 'ordini', component: GestioneOrdini },
      { path: 'coupons', component: GestioneCoupons },
      { path: 'giornate', component: GestioneGiornate },
      { path: 'modify', component: AdminChangePwd }
    ]
  },

  { path: 'coupons', component: CouponDialog },
  { path: 'login', component: LoginDialog },
  { path: 'register', component: RegisterDialog },
  { path: 'update', component: UpdateDialog },
  { path: 'ordini-dettaglio', component: OrdineDettaglio },
  { path: 'carrello', component: Carrello },
  { path: 'checkout', component: Checkout},
  { path: 'emailValidation', component: EmailValidation },
  { path: 'forgot-password', component: PasswordDimenticataComponent },
  {
  path: 'resetPassword/:token',
  component: ResetPasswordComponent
},

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }