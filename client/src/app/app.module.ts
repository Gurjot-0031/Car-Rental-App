import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RootComponent } from './root/root.component';
import {RouterModule} from "@angular/router";
import { TestComponent } from './test/test.component';
import {RoutingModule} from "./routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import { HomeComponent } from './home/home.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { LogInComponent } from './login/log-in.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    RootComponent,
    TestComponent,
    HomeComponent,
    TestComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    HttpClientModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  entryComponents: [
    RootComponent
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
