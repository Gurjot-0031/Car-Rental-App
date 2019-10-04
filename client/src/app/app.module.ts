import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RootComponent } from './root/root.component';
import {RouterModule} from "@angular/router";
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
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import { VehicleCatalogComponent } from './vehicle-catalog/vehicle-catalog.component';
import { ClientRecordsComponent } from './client-records/client-records.component';
import { RentalsComponent } from './rentals/rentals.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReturnsComponent } from './returns/returns.component';
import {MatIconModule} from "@angular/material/icon";
import { DialogClientRecordComponent } from './client-records/dialog-client-record/dialog-client-record.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    RootComponent,
    HomeComponent,
    LogInComponent,
    VehicleCatalogComponent,
    ClientRecordsComponent,
    RentalsComponent,
    ReservationsComponent,
    ReturnsComponent,
    DialogClientRecordComponent
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
    MatSnackBarModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  entryComponents: [
    RootComponent,
    DialogClientRecordComponent
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
