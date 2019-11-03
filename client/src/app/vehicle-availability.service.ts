import {Injectable} from "@angular/core";

import * as _moment from 'moment';
import {Vehicle, VehicleApiService} from "./api/vehicle-api.service";
import {TransactionApiService} from "./api/transaction-api.service";


@Injectable({
  providedIn: 'root'
})
export class VehicleAvailabilityService {

  constructor(private transactionApiService: TransactionApiService,
              private vehicleApiService: VehicleApiService) {}

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
