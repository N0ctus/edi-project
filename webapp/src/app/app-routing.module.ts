import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AuthGuardService as AuthGuard
} from './auth-guard.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './home/login/login.component';
import { HomeComponent } from './home/home.component';
import { DataTableComponent } from './navigation/data-table/data-table.component';
import { UsersTableComponent } from './navigation/users-table/users-table.component';
import { UsersEmailsComponent } from './navigation/users-emails/users-emails.component';
import { SettingsComponent } from './navigation/settings/settings.component';

const routes: Routes = [
  { path: 'home', component: AppComponent, canActivate : [AuthGuard] },
  { path: 'login', component : LoginComponent},
  { path: 'dashboard', component : HomeComponent},
  { path: 'data-table', component : DataTableComponent},
  { path: 'users', component : UsersTableComponent},
  { path: 'emails', component : UsersEmailsComponent},
  { path: 'settings', component : SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
