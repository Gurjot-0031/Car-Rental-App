import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleApiService {

  constructor(private http: HttpClient) { }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/api/vehicles');
  }

  createVehicle(vehicle: Vehicle) {
    return this.http.post('/api/vehicle', vehicle);
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
}
