import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './home/login/login.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { CardComponent } from './ui/card/card.component';
import { ChartCardComponent } from './ui/chart-card/chart-card.component';

import { HighchartsChartModule } from 'highcharts-angular';

import { AgGridModule } from 'ag-grid-angular';
import { DataTableComponent } from './navigation/data-table/data-table.component';
import { UsersTableComponent } from './navigation/users-table/users-table.component';
import { ImportDataComponent } from './navigation/import-data/import-data.component';
import { SettingsComponent } from './navigation/settings/settings.component';
import { TokenInterceptor } from 'auth/token.interceptor';

import * as Highcharts from 'highcharts';
import theme from 'highcharts/themes/dark-unica';
theme(Highcharts);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    CardComponent,
    ChartCardComponent,
    DataTableComponent,
    UsersTableComponent,
    ImportDataComponent,
    SettingsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    HighchartsChartModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
