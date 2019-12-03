import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResourceTimeOutService} from "../resource-time-out.service";

@Injectable({
  providedIn: 'root'
})
export class VehicleApiService {

  constructor(
    private http: HttpClient,
    private resourceTimeoutService: ResourceTimeOutService,
  ) { }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/api/vehicle');
  }

  getVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.get<Vehicle>('/api/vehicle/' + encodeURIComponent(vehicle.pkid));
  }

  getAllAvailableVehicles(start: string, end: string): Observable<Vehicle[]> {
    const dates = new AvailableDates();
    dates.start = start;
    dates.end = end;
    return this.http.post<Vehicle[]>('/api/vehicle/available-for-dates', dates);
  }

  createVehicle(vehicle: Vehicle) {
    return this.http.post('/api/vehicle', vehicle);
  }

  updateVehicle(vehicle: Vehicle): Observable<boolean> {
    return this.http.put<boolean>('/api/vehicle', vehicle);
  }

  // https://github.com/angular/angular/issues/19438
  deleteVehicle(vehicle: Vehicle) {
    return this.http.request('delete', '/api/vehicle/' + encodeURIComponent(vehicle.pkid));
  }

  isVehicleAvailableForDates(vehicle: Vehicle, start: string, end: string): Observable<boolean> {
    const dates = new AvailableDates();
    dates.start = start;
    dates.end = end;
    return this.http.post<boolean>('/api/vehicle/' + encodeURIComponent(vehicle.pkid) + '/available-for-dates', dates);
  }

  isResourceAvailable(vehicle: Vehicle): Observable<boolean> {
    return this.http.get<boolean>('/api/vehicle/' + encodeURIComponent(vehicle.pkid) + '/is-available');
  }

  setStartModify(vehicle: Vehicle) {
    return this.http.post('/api/vehicle/' + encodeURIComponent(vehicle.pkid) + '/start-modify', vehicle);
  }

  setStopModify(vehicle: Vehicle) {
    return this.http.post('/api/vehicle/' + encodeURIComponent(vehicle.pkid) + '/stop-modify', vehicle);
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
  active: number;
  version: number;
}

export class AvailableDates {
  start: string;
  end: string;
}
