import { Component, OnInit } from '@angular/core';
import {Transaction, TransactionApiService} from "../api/transaction-api.service";
import {MatTableDataSource} from "@angular/material/table";

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
    private transactionApiService: TransactionApiService) {
    this.dataSource = new MatTableDataSource<Transaction>();
  }
  ngOnInit() {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource<Transaction>();
    this.loadAllNotReturnedTransactions();
  }

  loadAllNotReturnedTransactions() {
    this.transactionApiService.getAllTransactions().subscribe(transactions => {
      this.dataSource.data = transactions.filter(t => !t.returnDate);
      this.isLoading = false;
    });
  }

  returnTransaction(transaction: Transaction) {
    console.log('patate');
    this.transactionApiService.returnTransaction(transaction).subscribe(() => {
      this.loadAllNotReturnedTransactions();
    });
  }
}
