import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Vehicle, VehicleApiService} from "../api/vehicle-api.service";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Client, ClientApiService} from "../api/client-api.service";
import {Transaction, TransactionApiService} from "../api/transaction-api.service";
import {MatDialog} from "@angular/material/dialog";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import * as _moment from "moment";
import {DialogVehicleDetailsComponent} from "../vehicle-catalog/dialog-vehicle-details/dialog-vehicle-details.component";
import {MatVerticalStepper} from "@angular/material/stepper";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {VehicleAvailabilityService} from "../vehicle-availability.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit, OnDestroy {

  dataSourceCancelReservation: MatTableDataSource<Transaction>;
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
  isClientUnavailable: boolean;
  client: Client;
  isVehicleFound: boolean;
  isVehicleSelected: boolean;
  makeReservationDisplayedColumns: string[] = ['type', 'make', 'model', 'actions'];
  cancelReservationDisplayedColumns: string[] =
    ['makeC', 'modelC', 'licensePlate', 'firstName', 'lastName', 'driverLicense', 'startDate', 'dueDate', 'actionsC'];

  isCancelTabIsLoading: boolean;

  clientWaitLoop: Subscription;

  constructor(
    private transactionApiService: TransactionApiService,
    private vehicleApiService: VehicleApiService,
    private clientApiService: ClientApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.isClientFound = false;
    this.isVehicleFound = false;
    this.isVehicleSelected = false;
    this.isCancelTabIsLoading = false;
    this.isClientUnavailable = false;
    this.dataSourceMakeReservation = new MatTableDataSource<Vehicle>();
    this.dataSourceCancelReservation = new MatTableDataSource<Transaction>();
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
          this.dataSourceMakeReservation.data = vehicles.filter(v => v.active === 1);
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
    this.vehicleApiService.isResourceAvailable(vehicle).subscribe(result => {
      if (result) {
        const transaction = new Transaction();
        transaction.vehicleId = vehicle.pkid;
        transaction.clientId = this.client.pkid;
        transaction.type = 'reservation';
        transaction.timestamp = _moment().format('YYYY-MM-DD');
        transaction.startDate = this.startDate.value.format('YYYY-MM-DD');
        transaction.dueDate = this.dueDate.value.format('YYYY-MM-DD');

        this.transactionApiService.createTransaction(transaction).subscribe(() => {
          this.isVehicleSelected = true;
        });
      } else {
        this.snackBar.open('Resource unavailable. Try again later', '', {duration: 5000});
      }
    });

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
      this.refreshReservationDataSource();
    }
  }

  refreshReservationDataSource() {
    this.isCancelTabIsLoading = true;
    this.transactionApiService.getAllReservations().subscribe(result => {
      this.dataSourceCancelReservation.data = result.filter(t => !t.cancelDate);
      this.isCancelTabIsLoading = false;
    });
  }

  cancelReservation(transaction: Transaction) {
    this.isCancelTabIsLoading = true;
    this.transactionApiService.cancelTransaction(transaction).subscribe(() => {
      this.isCancelTabIsLoading = false;
      this.refreshReservationDataSource();
    });
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
