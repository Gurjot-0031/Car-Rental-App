import { Component, OnInit } from '@angular/core';
import {Transaction, TransactionApiService} from "../api/transaction-api.service";
import {MatTableDataSource} from "@angular/material/table";
import {Vehicle} from "../api/vehicle-api.service";

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.scss']
})
export class ReturnsComponent implements OnInit {
  isLoading: boolean;
  dataSource: MatTableDataSource<Transaction>;
  displayedColumns: string[] =
    ['makeC', 'modelC', 'licensePlate', 'firstName', 'lastName', 'driverLicense', 'startDate', 'dueDate', 'actionsC'];

  constructor(
    private transactionApiService: TransactionApiService) { }

  ngOnInit() {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource<Transaction>();

    this.loadAllNotReturnedTransactions();
  }

  loadAllNotReturnedTransactions() {
    let activeReservations = this.transactionApiService.getReservations().filter(r => !r.returnDate);
    let activeRentals = this.transactionApiService.getRentals().filter(r => !r.returnDate);

    this.dataSource = new MatTableDataSource<Transaction>();

    activeReservations.forEach(x => this.dataSource.data.push(x));
    activeRentals.forEach(x => this.dataSource.data.push(x));

    this.isLoading = false;
  }

  returnTransaction(transaction: Transaction) {
    this.transactionApiService.returnTransaction(transaction);
    this.loadAllNotReturnedTransactions();
  }
}
