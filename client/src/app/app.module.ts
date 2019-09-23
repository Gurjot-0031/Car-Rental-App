import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RootComponent } from './root/root.component';
import {RouterModule} from "@angular/router";
import { TestComponent } from './test/test.component';
import {RoutingModule} from "./routing.module";

@NgModule({
  declarations: [
    RootComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RoutingModule
  ],
  entryComponents: [
    RootComponent
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
