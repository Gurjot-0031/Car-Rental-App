import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TransactionApiService, Transaction, Rental, Reservation } from '../api/transaction-api.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  displayedColumns: string[] = ['licensePlate', 'driverLicense', 'type', 'startDate', 'dueDate', 'returnDate', 'cancelDate'];

  licensePlate = new FormControl();
  driverLicense = new FormControl();
  type = new FormControl();
  startDate = new FormControl();
  dueDate = new FormControl();
  returnDate = new FormControl();
  cancelDate = new FormControl();

  dataSource: MatTableDataSource<Transaction>;

  constructor(private transactionApiService: TransactionApiService ) { }

  ngOnInit() {
    const rentals: Rental[] = this.transactionApiService.getRentals();
    const reservations: Reservation[] = this.transactionApiService.getReservations();

    this.dataSource = new MatTableDataSource<Transaction>();
    rentals.forEach(r => this.dataSource.data.push(r));
    reservations.forEach(r => this.dataSource.data.push(r));
  }

}
