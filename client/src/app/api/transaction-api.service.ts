import {Injectable} from '@angular/core';

import * as _moment from 'moment';
import {Vehicle, VehicleApiService} from "./vehicle-api.service";
import {Client} from "./client-api.service";
import {Moment} from "moment";
import {Observable, of} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {

  private rentals: Rental[];
  private reservations: Reservation[];
  private returns: Return[];

  constructor(private vehicleApiService: VehicleApiService) {
    this.rentals = [];
    this.reservations = [];
    this.returns = [];
  }

  getAvailableVehicleForDates(start: Moment, end: Moment): Observable<Vehicle[]> {
    let rentedVehicles: Vehicle[] = this.rentals.filter(r => !r.returned).map(r => r.vehicle);

    // get all vehicle, removes the one that are in the rented vehicles
    return this.vehicleApiService.getAllVehicles()
      .pipe(
        map(vehicles => {
          return vehicles.filter((v) =>
            !rentedVehicles.map(r => r.pkid).includes(v.pkid)
          );
        })
      )
  }

  makeRental(client: Client, vehicle: Vehicle, now: Moment, dueDate: Moment) {
    const rental = new Rental();
    rental.vehicle = vehicle;
    rental.client = client;
    rental.timestamp = now.format('YYYY-MM-DD');
    rental.dueDate = dueDate.format('YYYY-MM-DD');
    rental.returned = false;

    this.rentals.push(rental);
    //TODO return successful add
  }

  getRentals() {
    return this.rentals;
  }
}

// All these dates should be expressed as YYYY-MM-DD
export class Rental {
  timestamp: string;
  client: Client;
  vehicle: Vehicle;
  returned: boolean;
  dueDate: string;
}

export class Reservation {
  timestamp: string;
  client: Client;
  vehicle: Vehicle;
  returned: boolean;
  dueDate: string;
  startDate: string;
}

export class Return {
  timestamp: string;
  client: Client;
  vehicle: Vehicle;
}
