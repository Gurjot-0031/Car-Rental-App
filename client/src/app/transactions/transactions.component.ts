import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TransactionApiService, Transaction} from '../api/transaction-api.service';
import {MatTableDataSource} from '@angular/material/table';
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Moment} from "moment";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  isLoading: boolean;
  displayedColumns: string[] = ['licensePlate', 'driverLicense', 'type', 'timestamp', 'startDate', 'dueDate', 'returnDate', 'cancelDate'];

  licensePlate = new FormControl();
  driverLicense = new FormControl();
  type = new FormControl();
  timestamp = new FormControl();
  startDate = new FormControl();
  dueDate = new FormControl();
  returnDate = new FormControl();
  cancelDate = new FormControl();


  dataSource: MatTableDataSource<Transaction>;

  dueDateFilter: Moment;

  clientFilter = new FormControl();
  clientOptions: string[];
  clientLicensesFilteredOptions: Observable<string[]>;

  vehicleFilter = new FormControl();
  vehicleOptions: string[];
  vehiclePlatesFilteredOptions: Observable<string[]>;

  constructor(private transactionApiService: TransactionApiService) {
    this.dataSource = new MatTableDataSource<Transaction>();
  }

  ngOnInit() {
    this.isLoading = true;
    this.transactionApiService.getAllTransactions().subscribe(transactions => {
      this.dataSource.data = transactions;
      this.clientOptions = [...new Set(this.dataSource.data.map(t => t.client.driverLicense))];
      this.vehicleOptions = [...new Set(this.dataSource.data.map(t => t.vehicle.license))];
      this.isLoading = false;
    });
    this.clientLicensesFilteredOptions = this.clientFilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterClients(value))
      );

    this.vehiclePlatesFilteredOptions = this.vehicleFilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterVehicles(value))
      );
  }

  getTransactionType(transaction: Transaction): string {
    return transaction.returnDate ? 'return' : transaction.type;
  }


  private _filterClients(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.clientOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterVehicles(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.vehicleOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  applyFilters() {
    this.isLoading = true;
    this.transactionApiService.getAllTransactions().subscribe(transactions => {
      this.dataSource.data = transactions;
      this.clientOptions = [...new Set(this.dataSource.data.map(t => t.client.driverLicense))];
      this.vehicleOptions = [...new Set(this.dataSource.data.map(t => t.vehicle.license))];
      this.isLoading = false;

      this.dataSource.data = this.dataSource.data
        .filter(t => (this.clientFilter.value && this.clientFilter.value.length > 0) ?
          t.client.driverLicense === this.clientFilter.value : true)
        .filter(t => (this.vehicleFilter.value && this.vehicleFilter.value.length > 0) ?
          t.vehicle.license === this.vehicleFilter.value : true)
        .filter(t => this.dueDateFilter ? t.dueDate === this.dueDateFilter.format('YYYY-MM-DD') : true)
    });
  }
}
