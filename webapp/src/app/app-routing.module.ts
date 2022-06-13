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
import { ImportDataComponent } from './navigation/import-data/import-data.component';
import { LogoutComponent } from './navigation/logout/logout.component';

const routes: Routes = [
  { path: '*', redirectTo: 'dashboard' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'home', component: AppComponent, canActivate : [AuthGuard] },
  { path: 'login', component : LoginComponent},
  { path: 'dashboard', component : HomeComponent, canActivate : [AuthGuard]},
  { path: 'data-table', component : DataTableComponent, canActivate : [AuthGuard]},
  { path: 'users', component : UsersTableComponent, canActivate : [AuthGuard]},
  { path: 'import', component : ImportDataComponent, canActivate : [AuthGuard]},
  { path: 'logout', component : LogoutComponent, canActivate : [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
