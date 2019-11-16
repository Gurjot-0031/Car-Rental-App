import {Component, Inject, OnInit} from '@angular/core';
import {Vehicle, VehicleApiService} from "../../api/vehicle-api.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransactionApiService} from "../../api/transaction-api.service";
import * as _moment from 'moment';
import {VehicleAvailabilityService} from "../../vehicle-availability.service";

@Component({
  selector: 'app-dialog-vehicle-details',
  templateUrl: './dialog-vehicle-details.component.html',
  styleUrls: ['./dialog-vehicle-details.component.scss']
})
export class DialogVehicleDetailsComponent implements OnInit {

  isLoading: boolean;
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
    private vehicleApiService: VehicleApiService
  ) {
    this.vehicle = data['vehicle'];
    this.resultSetVehicles = data['resultSetVehicles'];
    this.vehicleApiService.isResourceAvailable(this.vehicle).subscribe(result => {
      if (result) {
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
            this.isNewVehicle = false;
            this.setFormValues(this.vehicle);
            this.vehicleForm.enable();
          });
        }

        //new
        else {
          this.isNewVehicle = true;
          this.vehicleForm.enable();
        }
        this.isLoading = false;
      } else {
        this.isResourceAvailable = false;
      }
    })
  }

  ngOnInit() {
    this.isLoading = true;
    this.isResourceAvailable = true;
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
    if (this.vehicle) {
      this.vehicleApiService.setStopModify(this.vehicle).subscribe();
    }
    this.dialogRef.close();
  }

  getVehicleStatus() {
    this.isLoading = true;
    const now = _moment().format('YYYY-MM-DD');
    this.vehicleApiService.isVehicleAvailableForDates(this.vehicle, now, now).subscribe(result => {
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
  }

  onModifyClicked() {
    let index = this.resultSetVehicles.indexOf(this.vehicle);
    this.resultSetVehicles[index].type = this.vehicleForm.getRawValue()['type'];
    this.resultSetVehicles[index].make = this.vehicleForm.getRawValue()['make'];
    this.resultSetVehicles[index].model = this.vehicleForm.getRawValue()['model'];
    this.resultSetVehicles[index].year = this.vehicleForm.getRawValue()['year'];
    this.resultSetVehicles[index].color = this.vehicleForm.getRawValue()['color'];
    this.resultSetVehicles[index].license = this.vehicleForm.getRawValue()['license'];

    this.vehicleApiService.updateVehicle(this.resultSetVehicles[index]).subscribe(() => {
      this.dialogRef.close();
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
      // TODO this probably needs to change for concurrency
      this.resultSetVehicles.push(vehicle);
      this.dialogRef.close();
    });
  }
}
