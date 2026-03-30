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
import { ChangePassword } from './features/auth/dialog/change-password/change-password';
import { PublicLayout } from './features/public/public-layout/public-layout';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { Navbar } from './shared/navbar/navbar';
import { Home } from './features/public/home/home';
import { Introduction } from './features/public/home/section/introduction/introduction';
import { Donation } from './features/public/home/section/donation/donation';
import { Dashboard } from './features/user/dashboard/dashboard';
import { UserLayout } from './features/user/user-layout/user-layout';
import { Ecommerce } from './features/public/ecommerce/ecommerce';

@NgModule({
  declarations: [
    App,
    PublicLayout,
    UserLayout,
    AdminLayout,
    LoginDialog,
    RegisterDialog,
    ChangePassword,
    Home,
    Navbar,
    Dashboard,
    Donation,
    Introduction,
    Ecommerce
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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