import {Injectable} from '@angular/core';


import {Vehicle, VehicleApiService} from "./vehicle-api.service";
import {Client, ClientApiService} from "./client-api.service";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {

  constructor(
    private http: HttpClient) {
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/transaction');
  }

  getAllRentals(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/rental');
  }

  getAllReservations(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/reservation');
  }

  getTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.get<Transaction>('/api/transaction/' + encodeURIComponent(transaction.pkid));
  }

  createTransaction(transaction: Transaction) {
    return this.http.post('/api/transaction', transaction);
  }

  returnTransaction(transaction: Transaction) {
    return this.http.put('/api/transaction/return', transaction);
  }

  cancelTransaction(transaction: Transaction) {
    return this.http.put('/api/transaction/cancel', transaction);
  }

}

// All these dates should be expressed as YYYY-MM-DD
export class Transaction {
  pkid: number;
  type: string;
  timestamp: string;
  client: Client;
  clientId: number;
  vehicleId: number;
  vehicle: Vehicle;
  startDate: string;
  dueDate: string;
  returnDate: string;
  cancelDate: string;
}
