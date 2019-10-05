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

  // https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  // TODO this method has a lot of refactoring opportunities
  getAvailableVehicleForDates(start: Moment, end: Moment): Observable<Vehicle[]> {
    let rentedVehicles: Vehicle[] =
      this.rentals
        .filter(r => !r.returned)
        .filter(r => start.isSameOrBefore(_moment(r.dueDate)) && end.isSameOrAfter(_moment(r.timestamp)))
        .map(r => r.vehicle);

    let reservedVehicles: Vehicle[] =
      this.reservations
        .filter(r => !r.returned)
        .filter(r => start.isSameOrBefore(_moment(r.dueDate)) && end.isSameOrAfter(_moment(r.timestamp)))
        .map(r => r.vehicle);

    // get all vehicle, removes the one that are in the rented vehicles
    return this.vehicleApiService.getAllVehicles()
      .pipe(
        map(vehicles => {
          return vehicles
            .filter((v) => !rentedVehicles.map(r => r.pkid).includes(v.pkid))
            .filter((v) => !reservedVehicles.map(r => r.pkid).includes(v.pkid))
        })
      );
  }

  isVehicleAvailableForDates(vehicle: Vehicle, start: Moment, end: Moment) {
    let isRented = this.rentals
      .filter(r => r.vehicle.pkid === vehicle.pkid) // Only consider the passed vehicle
      .filter(r => !r.returned) // Only consider rentals that aren't returned
      .filter(r => start.isSameOrBefore(_moment(r.dueDate)) && end.isSameOrAfter(_moment(r.timestamp)))
      .length > 0;

    let isReserved = this.reservations
      .filter(r => r.vehicle.pkid === vehicle.pkid)
      .filter(r => !r.returned)
      .filter(r => start.isSameOrBefore(_moment(r.dueDate)) && end.isSameOrAfter(_moment(r.startDate)))
      .length > 0;

    return !isRented && !isReserved;
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

  makeReservation(client: Client, vehicle: Vehicle, start: Moment, dueDate: Moment) {
    const reservation = new Reservation();
    reservation.vehicle = vehicle;
    reservation.client = client;
    reservation.timestamp = _moment().format('YYYY-MM-DD');
    reservation.startDate = start.format('YYYY-MM-DD');
    reservation.dueDate = dueDate.format('YYYY-MM-DD');
    reservation.returned = false;

    this.reservations.push(reservation);
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
