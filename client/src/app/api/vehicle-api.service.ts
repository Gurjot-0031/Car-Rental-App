import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleApiService {

  constructor(private http: HttpClient) { }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/api/vehicle');
  }

  createVehicle(vehicle: Vehicle) {
    return this.http.post('/api/vehicle', vehicle);
  }

  updateVehicle(vehicle: Vehicle) {
    return this.http.put('/api/vehicle', vehicle);
  }

  // https://github.com/angular/angular/issues/19438
  deleteVehicle(vehicle: Vehicle) {
    return this.http.request('delete', '/api/vehicle/' + encodeURIComponent(vehicle.pkid));
  }
}

export class Vehicle {
  pkid: number;
  type: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license: string;
  active: number
}
