import {Component, Inject, OnInit} from '@angular/core';
import {Vehicle, VehicleApiService} from "../../api/vehicle-api.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TransactionApiService} from "../../api/transaction-api.service";
import * as _moment from 'moment';
import {timer} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ResourceTimeOutService} from "../../resource-time-out.service";
import {DialogResourceTimeOutComponent} from "../../dialog-resource-time-out/dialog-resource-time-out.component";

@Component({
  selector: 'app-dialog-vehicle-details',
  templateUrl: './dialog-vehicle-details.component.html',
  styleUrls: ['./dialog-vehicle-details.component.scss']
})
export class DialogVehicleDetailsComponent implements OnInit {

  isLoading: boolean;
  isModifier: boolean;
  isResourceAvailable: boolean;
  isNewVehicle: boolean;
  vehicle: Vehicle;
  resultSetVehicles: Vehicle[];

  type = new FormControl();
  make = new FormControl();
  model = new FormControl();
  year = new FormControl();
  color = new FormControl();
  license = new FormControl();

  vehicleForm = new FormGroup({
      type: this.type,
      make: this.make,
      model: this.model,
      year: this.year,
      color: this.color,
      license: this.license
    }
  );

  vehicleStatus: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<DialogVehicleDetailsComponent>,
    private transactionApiService: TransactionApiService,
    private vehicleApiService: VehicleApiService,
    private snackBar: MatSnackBar,
    private resourceTimeOutService: ResourceTimeOutService,
    public dialog: MatDialog,
  ) {
    this.vehicle = data['vehicle'];
    this.resultSetVehicles = data['resultSetVehicles'];
  }

  async ngOnInit() {
    this.isLoading = true;
    this.isResourceAvailable = true;

    if (this.vehicle) {
      const repeat = timer(0, 5000);
      const loop = repeat.subscribe(() => {
        this.vehicleApiService.isResourceAvailable(this.vehicle).subscribe(result => {
          if (result) {
            this.setUp();
            this.isLoading = false;
            this.isResourceAvailable = true;
            loop.unsubscribe();
          } else {
            this.isResourceAvailable = false;
          }
        });
      })
    } else {
      this.setUp();
    }
  }

  setUp() {
    if (this.vehicle) {
      this.getVehicleStatus();
    }
    //user clicks view
    if (this.vehicle && this.data['action'] === 'view') {
      this.isNewVehicle = false;
      this.setFormValues(this.vehicle);
      this.vehicleForm.disable();
    }
    //modify
    else if (this.vehicle && this.data['action'] === 'modify') {
      this.vehicleApiService.setStartModify(this.vehicle).subscribe(() => {
        this.resourceTimeOutService.startTimer(this.vehicle);
        this.resourceTimeOutService.timeoutExpired.subscribe((res) => {
          this.dialog.open(DialogResourceTimeOutComponent, {
            disableClose: true,
            autoFocus: false,
            width: '40vw',
          }).afterClosed().subscribe(
            (isExtend) => {
              if (isExtend) {
                this.resourceTimeOutService.resetTimer();
              } else {
                this.resourceTimeOutService.stopTimer();
                this.onCancelClicked();
              }
            },
            (reason) => {
              this.resourceTimeOutService.stopTimer();
              this.onCancelClicked();
            }
          );
        });
        this.isModifier = true;
        this.isNewVehicle = false;
        this.setFormValues(this.vehicle);
        this.vehicleForm.enable();
      });
    }
    //new
    else {
      this.isResourceAvailable = true;
      this.isNewVehicle = true;
      this.vehicleForm.enable();
      this.isLoading = false;
    }
  }

  setFormValues(vehicle) {
    this.type.setValue(vehicle.type);
    this.make.setValue(vehicle.make);
    this.model.setValue(vehicle.model);
    this.year.setValue(vehicle.year);
    this.color.setValue(vehicle.color);
    this.license.setValue(vehicle.license)
  }

  onCancelClicked() {
    this.resourceTimeOutService.stopTimer();
    if (this.vehicle && this.isModifier) {
      this.vehicleApiService.setStopModify(this.vehicle).subscribe();
    }
    this.dialogRef.close();
  }

  getVehicleStatus() {
    this.isLoading = true;
    const now = _moment().format('YYYY-MM-DD');
    this.vehicleApiService.isVehicleAvailableForDates(this.vehicle, now, now).subscribe(result => {
      this.isLoading = false;
      this.vehicleStatus = result ? "Available" : "Unavailable";
    });
  }

  onPreviousClicked() {
    let index = this.resultSetVehicles.indexOf(this.vehicle);
    let previousIndex;
    if (index === 0) {
      previousIndex = this.resultSetVehicles.length - 1;
    } else {
      previousIndex = --index % this.resultSetVehicles.length;
    }
    this.vehicle = this.resultSetVehicles[previousIndex];
    this.getVehicleStatus();
    this.setFormValues(this.vehicle);
  }

  onNextClicked() {
    let index = this.resultSetVehicles.indexOf(this.vehicle);
    let nextIndex = ++index % this.resultSetVehicles.length;
    this.vehicle = this.resultSetVehicles[nextIndex];
    this.getVehicleStatus();
    this.setFormValues(this.vehicle);
    this.resourceTimeOutService.stopTimer();
  }

  onModifyClicked() {
    let index = this.resultSetVehicles.indexOf(this.vehicle);
    this.resultSetVehicles[index].type = this.vehicleForm.getRawValue()['type'];
    this.resultSetVehicles[index].make = this.vehicleForm.getRawValue()['make'];
    this.resultSetVehicles[index].model = this.vehicleForm.getRawValue()['model'];
    this.resultSetVehicles[index].year = this.vehicleForm.getRawValue()['year'];
    this.resultSetVehicles[index].color = this.vehicleForm.getRawValue()['color'];
    this.resultSetVehicles[index].license = this.vehicleForm.getRawValue()['license'];

    this.vehicleApiService.updateVehicle(this.resultSetVehicles[index]).subscribe((result) => {
      this.resourceTimeOutService.stopTimer();
      if (result) {
        this.dialogRef.close();
      } else {
        this.snackBar.open('Resource version outdated. Aborting operation.', '', {duration: 5000});
        this.vehicleApiService.getVehicle(this.vehicle).subscribe(updatedVehicle => {
          this.resultSetVehicles[index] = updatedVehicle;
        });
        this.dialogRef.close();
      }
    });
  }

  onAddClicked() {
    let vehicle = new Vehicle();
    vehicle.type = this.vehicleForm.getRawValue()['type'];
    vehicle.make = this.vehicleForm.getRawValue()['make'];
    vehicle.model = this.vehicleForm.getRawValue()['model'];
    vehicle.year = this.vehicleForm.getRawValue()['year'];
    vehicle.color = this.vehicleForm.getRawValue()['color'];
    vehicle.license = this.vehicleForm.getRawValue()['license'];

    this.vehicleApiService.createVehicle(vehicle).subscribe(() => {
      this.resultSetVehicles.push(vehicle);
      this.dialogRef.close();
    });
  }
}
