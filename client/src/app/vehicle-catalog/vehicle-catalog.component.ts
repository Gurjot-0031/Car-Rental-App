import { Component, OnInit } from '@angular/core';
import { Vehicle, VehicleApiService } from "../api/vehicle-api.service";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';

@Component({
  selector: 'app-vehicle-catalog',
  templateUrl: './vehicle-catalog.component.html',
  styleUrls: ['./vehicle-catalog.component.scss']
})
export class VehicleCatalogComponent implements OnInit {

  isLoading: boolean;
  allVehicles: Vehicle[];
  dataSource: MatTableDataSource<Vehicle>;

  displayedColumns: string[] = ['type', 'make', 'model', 'year', 'color'];

  make = new FormControl();
  model = new FormControl();
  type = new FormControl();
  color = new FormControl();
  minYear = new FormControl();
  maxYear = new FormControl();

  constructor(private vehicleApiService: VehicleApiService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Vehicle>();
  }

  listVehiclesInRandomOrder() {
    this.isLoading = true;
    if (!this.allVehicles) {
      this.vehicleApiService.getAllVehicles().subscribe(
        result => {
          this.allVehicles = result;
          this.dataSource.data = this.randomizeArray(this.allVehicles);
          this.isLoading = false;
        }
      );
    } else {
      this.dataSource.data = this.randomizeArray(this.allVehicles);
      this.isLoading = false;
    }
  }

  getMakeList() {
    return [
      'BMW', 'Honda', 'KIA', 'Mercedes', 'Jeep', 'Toyota', 'Volkswagen', 'Hyundai', 'Porsche',
      'Nissan', 'Ferrari'
    ]
  }

  getTypeList() {
    return ['Luxury', 'Van', 'SUV', 'Sedan', 'Hatchback'];
  }

  getModelList() {
    return [
      'Compass', 'S 550', 'Sedona', 'Rogue', 'X1', 'CR-V', 'Accent', '335i', 'Sienna', 'Golf',
      'Yaris', 'X6', 'Odyssey', 'Enzo', 'Accord', 'M5', 'Wrangler', 'Rio', 'Civic', '911', 'Forte5',
      'Grand Cherokee', 'Sorento'
    ]
  }

  getColorList() {
    return ['red', 'black', 'white', 'blue']
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  private randomizeArray(arr: any[]): any[] {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
