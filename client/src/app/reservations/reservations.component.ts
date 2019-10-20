import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Vehicle} from "../api/vehicle-api.service";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Client, ClientApiService} from "../api/client-api.service";
import {Reservation, TransactionApiService} from "../api/transaction-api.service";
import {MatDialog} from "@angular/material/dialog";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import * as _moment from "moment";
import {DialogVehicleDetailsComponent} from "../vehicle-catalog/dialog-vehicle-details/dialog-vehicle-details.component";
import {MatVerticalStepper} from "@angular/material/stepper";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  dataSourceCancelReservation: MatTableDataSource<Reservation>;
  dataSourceMakeReservation: MatTableDataSource<Vehicle>;
  driverLicense = new FormControl('', [
      Validators.required,
      this.regexValidator({pattern: '^[A-Z]{1}-\\d{4}-\\d{6}-\\d{2}$', msg: 'Must match format A-1234-123456-12'})
    ]
  );
  clientFormGroup = new FormGroup({
      driverLicense: this.driverLicense
    }
  );

  startDate = new FormControl('', Validators.required);
  dueDate = new FormControl('', Validators.required);
  dueDateFormGroup = new FormGroup({
    dueDate: this.dueDate,
    startDate: this.startDate
  });

  isClientFound: boolean;
  client: Client;
  isVehicleFound: boolean;
  isVehicleSelected: boolean;
  makeReservationDisplayedColumns: string[] = ['type', 'make', 'model', 'actions'];
  cancelReservationDisplayedColumns: string[] =
    ['makeC', 'modelC', 'licensePlate', 'firstName', 'lastName', 'driverLicense', 'startDate', 'dueDate', 'actionsC'];

  isCancelTabIsLoading: boolean;

  constructor(
    private transactionApiService: TransactionApiService,
    private clientApiService: ClientApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isClientFound = false;
    this.isVehicleFound = false;
    this.isVehicleSelected = false;
    this.isCancelTabIsLoading = false;
    this.dataSourceMakeReservation = new MatTableDataSource<Vehicle>();
    this.dataSourceCancelReservation = new MatTableDataSource<Reservation>();
  }

  // This is now duplicate code. Should extract
  public regexValidator(config: any): ValidatorFn {
    return (control: FormControl) => {
      let urlRegEx: RegExp = config.pattern;
      if (control.value && !control.value.match(urlRegEx)) {
        return {
          invalidMsg: config.msg
        };
      } else {
        return null;
      }
    };
  }

  searchForClient() {
    let client = this.clientApiService.getClientByDriverLicense(this.driverLicense.value);
    if (client) {
      this.isClientFound = true;
      this.client = client;
    } else {
      // TODO display message saying client was not found
    }
  }

  selectionChange($event: StepperSelectionEvent) {
    // index 2 = vehicle selection
    if ($event.selectedIndex === 2) {
      let pargol = 2;
      let now = _moment();
      let dueDate = this.dueDate.value;

      this.transactionApiService
        .getAvailableVehicleForDates(now, dueDate)
        .subscribe(vehicles => {
          this.dataSourceMakeReservation.data = vehicles;
          this.isVehicleFound = vehicles.length > 0;
        });
    }
  }

  viewVehicleDetails(vehicle: any) {
    this.dialog.open(DialogVehicleDetailsComponent, {
      disableClose: true,
      autoFocus: false,
      width: '40vw',
      data: {
        vehicle: vehicle,
        resultSetVehicles: this.dataSourceMakeReservation.data
      }
    });
  }

  reserveVehicle(vehicle: Vehicle) {
    // TODO add confirmation
    this.transactionApiService.makeReservation(this.client, vehicle, this.startDate.value, this.dueDate.value);
    this.isVehicleSelected = true;
  }

  reset(stepper: MatVerticalStepper) {
    this.clientFormGroup.reset();
    this.dueDateFormGroup.reset();
    this.isClientFound = false;
    this.isVehicleFound = false;
    this.isVehicleSelected = false;
    this.client = null;
    this.dataSourceMakeReservation.data = null;
    stepper.selectedIndex = 0;
  }

  onTabChange($event: MatTabChangeEvent) {
    if ($event.index === 1) {
      this.isCancelTabIsLoading = true;
      this.dataSourceCancelReservation.data = this.transactionApiService.getReservations();
      this.isCancelTabIsLoading = false;
    }

  }

  cancelReservation(res: Reservation) {
    this.transactionApiService.cancelReservation(res);
    this.isCancelTabIsLoading = true;
    this.dataSourceCancelReservation.data = this.transactionApiService.getReservations().filter(r => !r.cancelDate);
    this.isCancelTabIsLoading = false;
  }
}
