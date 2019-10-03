import { Component, OnInit } from '@angular/core';
import { Vehicle, VehicleApiService } from "../api/vehicle-api.service";
import { MatTableDataSource } from "@angular/material/table";

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

  randomizeArray(arr: any[]): any[] {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
