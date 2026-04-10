import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';

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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { LoginDialog } from './features/auth/dialog/login-dialog/login-dialog';
import { RegisterDialog } from './features/auth/dialog/register-dialog/register-dialog';
import { UpdateDialog } from './features/auth/dialog/update-dialog/update-dialog';
import { ConfirmDialog } from './features/auth/dialog/confirm-dialog/confirm-dialog';
import { SceltaUpdateDialog } from './features/admin/gestione-items/dialog/scelta-update-dialog/scelta-update-dialog';
import { ProdottoDialog } from './features/admin/gestione-items/dialog/prodotto-dialog/prodotto-dialog';
import { BigliettoDialog } from './features/admin/gestione-items/dialog/biglietto-dialog/biglietto-dialog';
import { PublicLayout } from './features/public/public-layout/public-layout';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { Navbar } from './shared/navbar/navbar';
import { Home } from './features/public/home/home';
import { Info } from './features/user/info/info';
import { ChangePwd } from './features/user/change-pwd/change-pwd';
import { Ordini } from './features/user/ordini/ordini';
import { Introduction } from './features/public/home/section/introduction/introduction';
import { Donation } from './features/public/home/section/donation/donation';
import { Eventi } from './features/public/home/section/eventi/eventi';
import { News } from './features/public/home/section/news/news';
import { SafePipe } from './shared/pipes/safe.pipe';
import { Ecommerce } from './features/public/ecommerce/ecommerce';
import { NavbarEcommerce } from './features/public/ecommerce/navbar-ecommerce/navbar-ecommerce';
import { Promo } from './features/public/ecommerce/section/promo/promo';
import { Categories } from './features/public/ecommerce/section/categories/categories';
import { Shop } from './features/public/ecommerce/section/shop/shop';
import { MaintenanceOverlay } from './shared/maintenance-overlay/maintenance-overlay';
import { NavbarUtente } from './features/user/navbar-utente/navbar-utente';
import { UserLayout } from './features/user/user-layout/user-layout';
import { AdminNavbar } from './features/admin/admin-navbar/admin-navbar';
import { AdminChangePwd } from './features/admin/admin-change-pwd/admin-change-pwd';
import { GestioneEventi } from './features/admin/gestione-eventi/gestione-eventi';
import { GestioneItems } from './features/admin/gestione-items/gestione-items';
import { GestioneUtente } from './features/admin/gestione-utenti/gestione-utenti';
import { GestioneOridini } from './features/admin/gestione-oridini/gestione-oridini';
import { ProdottiManager } from './features/admin/gestione-items/prodotti-manager/prodotti-manager';
import { BigliettiManager } from './features/admin/gestione-items/biglietti-manager/biglietti-manager';
import { ShopBiglietti } from './features/public/ecommerce/section/shop-biglietti/shop-biglietti';
import { ShopMerch } from './features/public/ecommerce/section/shop-merch/shop-merch';
import { EventoDialog } from './features/admin/gestione-eventi/evento-dialog/evento-dialog';
import { UploaditemDialog } from './features/admin/gestione-items/dialog/upload-item-dialog/upload-item-dialog';

@NgModule({
  declarations: [
    App,
    PublicLayout,
    UserLayout,
    AdminLayout,
    LoginDialog,
    RegisterDialog,
    UpdateDialog,
    ConfirmDialog,
    SceltaUpdateDialog,
    ChangePwd,
    Home,
    Info,
    Ordini,
    Navbar,
    Donation,
    Eventi,
    News,
    Introduction,
    Ecommerce,
    NavbarEcommerce,
    Promo,
    Categories,
    Shop,
    MaintenanceOverlay,
    NavbarUtente,
    AdminNavbar,
    AdminChangePwd,
    GestioneEventi,
    GestioneItems,
    GestioneUtente,
    ProdottiManager,
    BigliettiManager,
    SceltaUpdateDialog,
    ProdottoDialog,
    BigliettoDialog,
    ShopBiglietti,
    ShopMerch,
    EventoDialog,
    GestioneOridini,
    UploaditemDialog,
    SafePipe
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
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }