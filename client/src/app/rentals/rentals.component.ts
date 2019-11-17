import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Transaction, TransactionApiService} from "../api/transaction-api.service";
import {Client, ClientApiService} from "../api/client-api.service";

import * as _moment from 'moment';
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {DialogVehicleDetailsComponent} from "../vehicle-catalog/dialog-vehicle-details/dialog-vehicle-details.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Vehicle, VehicleApiService} from "../api/vehicle-api.service";
import {MatVerticalStepper} from "@angular/material/stepper";
import {Subscription, timer} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.scss']
})
export class RentalsComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<Vehicle>;
  driverLicense = new FormControl('', [
      Validators.required,
      this.regexValidator({pattern: '^[A-Z]{1}-\\d{4}-\\d{6}-\\d{2}$', msg: 'Must match format A-1234-123456-12'})
    ]
  );
  clientFormGroup = new FormGroup({
    driverLicense: this.driverLicense
    }
  );

  dueDate = new FormControl('', Validators.required);
  dueDateFormGroup = new FormGroup({
    dueDate: this.dueDate
  });

  isClientFound: boolean;
  isClientUnavailable: boolean;
  client: Client;
  isVehicleFound: boolean;
  isVehicleSelected: boolean;
  displayedColumns: string[] = ['type', 'make', 'model', 'actions'];

  clientWaitLoop: Subscription;

  constructor(
    private transactionApiService: TransactionApiService,
    private vehicleApiService: VehicleApiService,
    private clientApiService: ClientApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.isClientFound = false;
    this.isClientUnavailable = false;
    this.isVehicleFound = false;
    this.isVehicleSelected = false;
    this.dataSource = new MatTableDataSource<Vehicle>();
  }

  ngOnDestroy() {
    if (this.client) {
      this.clientApiService.setStopModify(this.client).subscribe();
    }
  }

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
    this.clientApiService.getClientByDriverLicense(this.driverLicense.value).subscribe(result => {
      if (result) {
        this.client = result;

        const repeat = timer(0, 5000);

        this.clientWaitLoop = repeat.subscribe(() => {
          this.clientApiService.isResourceAvailable(this.client).subscribe(isAvailable => {
            if (isAvailable) {
              this.isClientFound = true;
              this.isClientUnavailable = false;
              this.clientApiService.setStartModify(this.client).subscribe();
              this.clientWaitLoop.unsubscribe();
            } else {
              this.isClientUnavailable = true;
            }
          })
        });
      }
    });
  }

  selectionChange($event: StepperSelectionEvent) {
    // index 2 = vehicle selection
    if ($event.selectedIndex === 2) {
      let now = _moment().format('YYYY-MM-DD');
      let dueDate = this.dueDate.value.format('YYYY-MM-DD');

      this.vehicleApiService
        .getAllAvailableVehicles(now, dueDate)
        .subscribe(vehicles => {
          this.dataSource.data = vehicles.filter(v => v.active === 1);
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
        resultSetVehicles: this.dataSource.data
      }
    });
  }

  rentVehicle(vehicle: Vehicle) {
    this.vehicleApiService.isResourceAvailable(vehicle).subscribe(result => {
      if (result) {
        const transaction = new Transaction();
        transaction.vehicle = vehicle;
        transaction.vehicleId = vehicle.pkid;
        transaction.clientId = this.client.pkid;
        transaction.client = this.client;
        transaction.type = 'rental';
        transaction.timestamp = _moment().format('YYYY-MM-DD');
        transaction.startDate = _moment().format('YYYY-MM-DD');
        transaction.dueDate = this.dueDate.value.format('YYYY-MM-DD');
        this.transactionApiService.createTransaction(transaction).subscribe(() => {
          this.isVehicleSelected = true;
        });
      } else {
        this.snackBar.open('Resource unavailable. Try again later', '', {duration: 5000});
      }
    })


  }

  reset(stepper: MatVerticalStepper) {
    this.clientFormGroup.reset();
    this.dueDateFormGroup.reset();
    this.isClientFound = false;
    this.isVehicleFound = false;
    this.isVehicleSelected = false;
    this.client = null;
    this.dataSource.data = null;
    stepper.selectedIndex = 0;
  }

  clearClient() {
    this.isClientFound = false;
    this.clientApiService.setStopModify(this.client).subscribe();
    this.client = null;
    this.driverLicense.setValue("");
    this.driverLicense.markAsPristine();
  }

  onCancelWaitClientClicked() {
    this.isClientFound = false;
    this.isClientUnavailable = false;
    this.client = null;
    this.driverLicense.setValue("");
    this.driverLicense.markAsPristine();
    this.clientWaitLoop.unsubscribe();
  }
}
