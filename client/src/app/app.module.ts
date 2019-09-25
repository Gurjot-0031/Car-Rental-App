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

@NgModule({
  declarations: [
    RootComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    HttpClientModule,
    MatButtonModule
  ],
  entryComponents: [
    RootComponent
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
