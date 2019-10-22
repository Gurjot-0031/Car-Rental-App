import { Component, OnInit } from '@angular/core';
import { Vehicle, VehicleApiService } from "../api/vehicle-api.service";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {DialogVehicleDetailsComponent} from "./dialog-vehicle-details/dialog-vehicle-details.component";
import {LogInService} from "../api/login-in.service";

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-vehicle-catalog',
  templateUrl: './vehicle-catalog.component.html',
  styleUrls: ['./vehicle-catalog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
  ]
})
export class VehicleCatalogComponent implements OnInit {

  isLoading: boolean;
  resultVehicles: Vehicle[];
  dataSource: MatTableDataSource<Vehicle>;

  displayedColumns = ['type', 'make', 'model', 'year', 'color', 'actions'];

  make = new FormControl();
  model = new FormControl();
  type = new FormControl();
  color = new FormControl();
  minYear = new FormControl(moment().subtract(20, 'years'));
  maxYear = new FormControl(moment());

  sortColumn: string;
  sortColumnsOptions = ['Random', 'type', 'make', 'model', 'year', 'color'];
  sortDirection: string;
  sortDirectionOptions = ['Ascending', 'Descending'];

  constructor(
    private loginService: LogInService,
    private vehicleApiService: VehicleApiService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Vehicle>();
  }

  listVehiclesInRandomOrder() {
    this.isLoading = true;
    if (!this.resultVehicles) {
      this.vehicleApiService.getAllVehicles().subscribe(
        result => {
          this.resultVehicles = result;
          this.dataSource.data = this.randomizeArray(this.resultVehicles);
          this.isLoading = false;
        }
      );
    } else {
      this.dataSource.data = this.randomizeArray(this.resultVehicles);
      this.isLoading = false;
    }
  }

  searchWithFilters() {
    this.isLoading = true;
    if (!this.resultVehicles) {
      this.vehicleApiService.getAllVehicles().subscribe(
        result => {
          this.resultVehicles = result;
          let filtered = this.applyFilters(this.resultVehicles);
          this.dataSource.data = this.applySorting(filtered);
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
      let filtered = this.applyFilters(this.resultVehicles);
      this.dataSource.data = this.applySorting(filtered);
    }
  }

  private applyFilters(vehicles: Vehicle[]): Vehicle[] {
    return vehicles
      .filter(v => (this.make.value && this.make.value.length > 0) ? this.make.value.includes(v.make) : true)
      .filter(v => (this.type.value && this.type.value.length > 0) ? this.type.value.includes(v.type) : true)
      .filter(v => (this.model.value && this.model.value.length > 0) ? this.model.value.includes(v.model) : true)
      .filter(v => (this.color.value && this.color.value.length > 0) ? this.color.value.includes(v.color) : true)
      .filter(v => this.minYear.value ? parseInt(this.minYear.value.format('YYYY'), 10) <= v.year : true)
      .filter(v => this.maxYear.value ? parseInt(this.maxYear.value.format('YYYY'), 10) >= v.year : true);
  }

  private applySorting(vehicles: Vehicle[]): Vehicle[] {
    if (this.sortColumn === 'Random') {
      return this.randomizeArray(vehicles);
    } else {
      return vehicles.sort(this.propertyComparator(this.sortColumn));
    }

  }
  // https://stackoverflow.com/questions/8537602/any-way-to-extend-javascripts-array-sort-method-to-accept-another-parameter
  propertyComparator = (property) => {
    if (!this.sortDirection || this.sortDirection === 'Ascending') {
      return (a, b) => a[property] == b[property] ? 0 :
        a[property] < b[property] ? -1 : 1;
    } else {
      return (a, b) => a[property] == b[property] ? 0 :
        a[property] < b[property] ? 1 : -1;
    }
  };


  private propertySort(property) {
    if (!this.sortDirection || this.sortDirection === 'Ascending') {

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

  setMinYear(normalizedYear, datepicker: MatDatepicker<any>) {
    datepicker.close();
    const ctrlValue = this.minYear.value;
    ctrlValue.year(normalizedYear.year());
    this.minYear.setValue(ctrlValue);
  }

  setMaxYear(normalizedYear, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.maxYear.value;
    ctrlValue.year(normalizedYear.year());
    this.maxYear.setValue(ctrlValue);
    datepicker.close();
  }

  private randomizeArray(arr: any[]): any[] {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  viewVehicleDetails(vehicle: any) {
    this.dialog.open(DialogVehicleDetailsComponent, {
      disableClose: true,
      autoFocus: false,
      width: '40vw',
      data: {
        vehicle: vehicle,
        resultSetVehicles: this.dataSource.data,
        action: 'view'
      }
    });
  }

  deleteVehicle(vehicle: any) {
    if(confirm("Confirm delete.."))
    {
      let index:number = this.dataSource.data.findIndex(d => d === vehicle);
      this.dataSource.data.splice(index,1);
      this.dataSource = new MatTableDataSource<Vehicle>(this.dataSource.data);
    }
  }


  isAdmin() {
    return this.loginService.getRole() === 'admin';
  }

  modifyVehicleDetails(vehicle: any) {
    this.dialog.open(DialogVehicleDetailsComponent, {
      disableClose: true,
      autoFocus: false,
      width: '40vw',
      data: {
        vehicle: vehicle,
        resultSetVehicles: this.dataSource.data,
        action: `modify`
      }
    });
  }

  addNewVehicle() {
    this.dialog.open(DialogVehicleDetailsComponent, {
      disableClose: true,
      autoFocus: false,
      width: '40vw',
      data: {
        resultSetVehicles: this.dataSource.data,
        action: `new`
      }
    });
  }
}
