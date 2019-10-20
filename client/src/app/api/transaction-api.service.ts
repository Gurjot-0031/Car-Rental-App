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

  // These fields simulate pkid for when we have databases
  private rentalId = 1;
  private reservationId = 1;

  private rentals: Rental[];
  private reservations: Reservation[];

  constructor(private vehicleApiService: VehicleApiService) {
    this.rentals = [];
    this.reservations = [];
  }

  // https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  // TODO this method has a lot of refactoring opportunities
  getAvailableVehicleForDates(start: Moment, end: Moment): Observable<Vehicle[]> {
    let rentedVehicles: Vehicle[] =
      this.rentals
        .filter(r => !r.returnDate)
        .filter(r => start.isSameOrBefore(_moment(r.dueDate)) && end.isSameOrAfter(_moment(r.startDate)))
        .map(r => r.vehicle);

    let reservedVehicles: Vehicle[] =
      this.reservations
        .filter(r => !r.returnDate)
        .filter(r => !r.cancelDate)
        .filter(r => start.isSameOrBefore(_moment(r.dueDate)) && end.isSameOrAfter(_moment(r.startDate)))
        .map(r => r.vehicle);

    // get all vehicle, removes the one that are in the unavailable vehicles
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
      .filter(r => !r.returnDate) // Only consider rentals that aren't returned
      .filter(r => start.isSameOrBefore(_moment(r.dueDate)) && end.isSameOrAfter(_moment(r.startDate)))
      .length > 0;

    let isReserved = this.reservations
      .filter(r => r.vehicle.pkid === vehicle.pkid)
      .filter(r => !r.returnDate)
      .filter(r => !r.cancelDate)
      .filter(r => start.isSameOrBefore(_moment(r.dueDate)) && end.isSameOrAfter(_moment(r.startDate)))
      .length > 0;

    return !isRented && !isReserved;
  }

  makeRental(client: Client, vehicle: Vehicle, now: Moment, dueDate: Moment) {
    const rental = new Rental();
    rental.vehicle = vehicle;
    rental.client = client;
    rental.timestamp = now.format('YYYY-MM-DD');
    rental.startDate = now.format('YYYY-MM-DD');
    rental.dueDate = dueDate.format('YYYY-MM-DD');
    rental.pkid = this.rentalId++;

    this.rentals.push(rental);
    //TODO return successful add
  }

  makeReservation(client: Client, vehicle: Vehicle, start: Moment, dueDate: Moment) {
    const reservation = new Reservation();
    reservation.vehicle = vehicle;
    reservation.client = client;
    reservation.timestamp = _moment().format('YYYY-MM-DD');
    reservation.startDate = start.format('YYYY-MM-DD');
    reservation.dueDate = dueDate.format('YYYY-MM-DD');
    reservation.pkid = this.reservationId++;

    this.reservations.push(reservation);
  }

  getRentals(): Rental[] {
    return this.rentals;
  }

  getReservations(): Reservation[] {
    return this.reservations;
  }

  cancelReservation(reservation: Reservation) {
    this.reservations.filter(r => r.pkid == reservation.pkid)[0].cancelDate = this.getTimestampNow();
  }

  returnTransaction(transaction: Transaction) {
    if (transaction instanceof Reservation) {
      this.reservations.filter(r => r.pkid == transaction.pkid)[0].returnDate = this.getTimestampNow();
    } else if (transaction instanceof Rental) {
      this.rentals.filter(r => r.pkid == transaction.pkid)[0].returnDate = this.getTimestampNow();
    }
  }

  getTimestampNow(): string {
    return _moment().format('YYYY-MM-DD');
  }

}

// All these dates should be expressed as YYYY-MM-DD
export class Transaction {
  pkid: number;
  timestamp: string;
  client: Client;
  vehicle: Vehicle;
  startDate: string;
  dueDate: string;
  returnDate: string = null;
}

export class Rental extends Transaction {
}

export class Reservation extends Transaction {
  cancelDate: string = null;
}
