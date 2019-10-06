import {Component, Inject, OnInit} from '@angular/core';
import {Vehicle} from "../../api/vehicle-api.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransactionApiService} from "../../api/transaction-api.service";

import * as _moment from 'moment';

@Component({
  selector: 'app-dialog-vehicle-details',
  templateUrl: './dialog-vehicle-details.component.html',
  styleUrls: ['./dialog-vehicle-details.component.scss']
})
export class DialogVehicleDetailsComponent implements OnInit {

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

  isAvailable: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<DialogVehicleDetailsComponent>,
    private transactionApiService: TransactionApiService,
  ) {
    this.vehicle = data['vehicle'];
    this.resultSetVehicles = data['resultSetVehicles'];
    this.isAvailable = true;

    if (this.vehicle) {
      this.isNewVehicle = false;
      this.setFormValues(this.vehicle);
      this.vehicleForm.disable();
    } else {
      this.isNewVehicle = true;
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

  ngOnInit() {
  }

  onCancelClicked() {
    this.dialogRef.close();
  }

  getVehicleStatus() {
    return this.transactionApiService.isVehicleAvailableForDates(this.vehicle, _moment(), _moment()) ?
      'Available' : 'Unavailable';
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
    this.setFormValues(this.vehicle);
  }

  onNextClicked() {
    let index = this.resultSetVehicles.indexOf(this.vehicle);
    let nextIndex = ++index % this.resultSetVehicles.length;
    this.vehicle = this.resultSetVehicles[nextIndex];
    this.setFormValues(this.vehicle);
  }
}
