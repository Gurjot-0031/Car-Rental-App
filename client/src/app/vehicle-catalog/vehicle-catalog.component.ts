import { Component, OnInit } from '@angular/core';
import {Vehicle, VehicleApiService} from "../api/vehicle-api.service";

@Component({
  selector: 'app-vehicle-catalog',
  templateUrl: './vehicle-catalog.component.html',
  styleUrls: ['./vehicle-catalog.component.scss']
})
export class VehicleCatalogComponent implements OnInit {

  isLoading: boolean;
  vehicles: Vehicle[];

  displayedColumns: string[] = ['type', 'make', 'model', 'year', 'color'];

  constructor(private vehicleApiService: VehicleApiService) { }

  ngOnInit() {
    this.isLoading = true;
    this.vehicleApiService.getAllVehicles().subscribe(
      result => {
        this.vehicles = result;
        this.isLoading = false;
      }
    )
  }
}
