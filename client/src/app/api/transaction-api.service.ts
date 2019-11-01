import {Injectable} from '@angular/core';

import * as _moment from 'moment';
import {Vehicle, VehicleApiService} from "./vehicle-api.service";
import {Client, ClientApiService} from "./client-api.service";
import {Moment} from "moment";
import {Observable, of} from "rxjs";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {

  // These fields simulate pkid for when we have databases
  private rentalId = 1;
  private reservationId = 1;

  private rentals: Rental[];
  private reservations: Reservation[];

  constructor(
    private vehicleApiService: VehicleApiService,
    private clientApiService: ClientApiService) {
    this.rentals = [];
    this.reservations = [];
  }

  setupTransactions(): Observable<boolean> {
    if (this.rentals.length > 0 && this.reservations.length > 0) {
      return of(true);
    }
    return this.vehicleApiService.getAllVehicles()
      .pipe(
        tap(vehicles => {
          const clients = this.clientApiService.getAllClientRecords();

          // 5 Currently rented vehicles
          for (let i = 0; i < 5; i++) {
            const rental = new Rental();
            rental.client = clients[i];
            rental.vehicle = vehicles[i + 20];
            rental.pkid = i;
            rental.timestamp = _moment().format('YYYY-MM-DD');
            rental.startDate = _moment().format('YYYY-MM-DD');
            rental.dueDate = _moment().add(i, 'days').format('YYYY-MM-DD');
            this.rentals.push(rental);
          }

          // 5 Previously returned vehicles
          for (let i = 5; i < 10; i++) {
            const rental = new Rental();
            rental.client = clients[i];
            rental.vehicle = vehicles[i + 40];
            rental.pkid = i;
            rental.timestamp = _moment().subtract(10, 'days').format('YYYY-MM-DD');
            rental.startDate = _moment().subtract(10, 'days').format('YYYY-MM-DD');
            rental.dueDate = _moment().subtract(7, 'days').format('YYYY-MM-DD');
            rental.returnDate = _moment().subtract(7, 'days').format('YYYY-MM-DD')
            this.rentals.push(rental);
          }

          // 10 Future reservations
          for (let i = 0; i < 10; i++) {
            const reservation = new Reservation();
            reservation.client = clients[i];
            reservation.vehicle = vehicles[i];
            reservation.pkid = i;
            reservation.timestamp = _moment().format('YYYY-MM-DD');
            reservation.startDate = _moment().add(2, 'days').format('YYYY-MM-DD');
            reservation.dueDate = _moment().add(12, 'days').format('YYYY-MM-DD');
            this.reservations.push(reservation);
          }
        }),
        map(() => true)
      )
  }

  // https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  // TODO this method has a lot of refactoring opportunities
  getAvailableVehicleForDates(start: Moment, end: Moment): Observable<Vehicle[]> {
    let rentedVehicles: Vehicle[] =
      this.rentals
        .filter(r => r.vehicle.active === 1)
        .filter(r => !r.returnDate)
        .filter(r => !(start.isBefore(_moment(r.dueDate)) && end.isAfter(_moment(r.startDate))))
        .map(r => r.vehicle);

    let reservedVehicles: Vehicle[] =
      this.reservations
        .filter(r => r.vehicle.active === 1)
        .filter(r => !r.returnDate)
        .filter(r => !r.cancelDate)
        .filter(r => !(start.isBefore(_moment(r.dueDate)) && end.isAfter(_moment(r.startDate))))
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
    if (vehicle.active === 0) {
      return false;
    }
    let isRented = this.rentals
      .filter(r => r.vehicle.pkid === vehicle.pkid) // Only consider the passed vehicle
      .filter(r => !r.returnDate) // Only consider rentals that aren't returned
      .filter(r => !(start.isBefore(_moment(r.dueDate)) && end.isAfter(_moment(r.startDate))))
      .length > 0;

    let isReserved = this.reservations
      .filter(r => r.vehicle.pkid === vehicle.pkid)
      .filter(r => !r.returnDate)
      .filter(r => !r.cancelDate)
      .filter(r => !(start.isBefore(_moment(r.dueDate)) && end.isAfter(_moment(r.startDate))))
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
