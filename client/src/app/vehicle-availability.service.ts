import {Injectable} from "@angular/core";

import * as _moment from 'moment';
import {Moment} from "moment";
import {map, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {Vehicle, VehicleApiService} from "./api/vehicle-api.service";
import {Client} from "./api/client-api.service";
import {TransactionApiService} from "./api/transaction-api.service";


@Injectable({
  providedIn: 'root'
})
export class TransactionAvailabilityService {

  constructor(private transactionApiService: TransactionApiService,
              private vehicleApiService: VehicleApiService) {}

  // https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  // TODO this method has a lot of refactoring opportunities
  getAvailableVehicleForDates(start: Moment, end: Moment): Observable<Vehicle[]> {
    return this.transactionApiService.getAllTransactions().pipe(
      map(transactions => transactions
        .filter(r => r.vehicle.active === 1)
        .filter(r => !r.returnDate)
        .filter(r => !r.cancelDate)
        .filter(r => !(start.isBefore(_moment(r.dueDate)) && end.isAfter(_moment(r.startDate))))
        .map(r => r.vehicle)),
      tap(unavailableVehicles => {
        this.vehicleApiService.getAllVehicles().subscribe(allVehicles => {
          return allVehicles.filter(v => !unavailableVehicles.map(t => t.pkid).includes(v.pkid))
        })
      })
    );
  }

  isVehicleAvailableForDates(vehicle: Vehicle, start: string, end: string): boolean {
    if (vehicle.active === 0) {
      return false;
    }
    this.vehicleApiService.isVehicleAvailableForDates(vehicle, start, end).subscribe(value => {
      return value;
    });
  }

  getTimestampNow(): string {
    return _moment().format('YYYY-MM-DD');
  }
}
