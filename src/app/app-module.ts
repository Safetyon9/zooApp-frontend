import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginDialog } from './features/auth/dialog/login-dialog/login-dialog';
import { RegisterDialog } from './features/auth/dialog/register-dialog/register-dialog';
import { PublicLayout } from './features/public/public-layout/public-layout';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { Navbar } from './shared/navbar/navbar';
import { Home } from './features/public/home/home';
import { Info } from './features/user/info/info';
import { ChangePwd } from './features/user/change-pwd/change-pwd';
import { Introduction } from './features/public/home/section/introduction/introduction';
import { Donation } from './features/public/home/section/donation/donation';
import { Ecommerce } from './features/public/ecommerce/ecommerce';
import { NavbarEcommerce } from "./features/public/ecommerce/navbar-ecommerce/navbar-ecommerce";
import { Promo } from './features/public/ecommerce/section/promo/promo';
import { Categories } from './features/public/ecommerce/section/categories/categories';
import { Shop } from './features/public/ecommerce/section/shop/shop';
import { MaintenanceOverlay } from './shared/maintenance-overlay/maintenance-overlay';
import { NavbarUtente } from './features/user/navbar-utente/navbar-utente';
import { UserLayout } from './features/user/user-layout/user-layout';
import { AdminNavbar } from './features/admin/admin-navbar/admin-navbar';
import { GestioneEventi } from './features/admin/gestione-eventi/gestione-eventi';
import { GestioneProdotti } from './features/admin/gestione-prodotti/gestione-prodotti';
import { GestioneUtenti } from './features/admin/gestione-utenti/gestione-utenti';
import { Merch } from './features/admin/gestione-prodotti/merch/merch';
import { Biglietti } from './features/admin/gestione-prodotti/biglietti/biglietti';
import { CommonModule } from '@angular/common';
import { merge } from 'rxjs';

@NgModule({
  declarations: [
    App,
    PublicLayout,
    UserLayout,
    AdminLayout,
    LoginDialog,
    RegisterDialog,
    Home,
    Info,
    Navbar,
    Donation,
    Introduction,
    Ecommerce,
    NavbarEcommerce,
    Promo,
    Categories,
    Shop,
    MaintenanceOverlay,
    NavbarUtente,
    AdminNavbar,
    GestioneEventi,
    GestioneProdotti,
    GestioneUtenti,
    Merch,
    Biglietti
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }