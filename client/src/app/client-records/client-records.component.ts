import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogClientRecordComponent} from "./dialog-client-record/dialog-client-record.component";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-client-records',
  templateUrl: './client-records.component.html',
  styleUrls: ['./client-records.component.scss']
})
export class ClientRecordsComponent implements OnInit {

  isLoading: boolean;
  dataSource: MatTableDataSource<ClientRecord>;
  clientRecords: ClientRecord[];
  displayedColumns: string[] = ['lastName', 'firstName', 'driverLicense', 'expirationDate', 'phoneNumber', 'actions'];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.createStubClientRecords();
    this.dataSource = new MatTableDataSource<ClientRecord>();
    this.dataSource.data = this.clientRecords;
    this.isLoading = false;
  }

  // This method is to be replaced when we implement concurrency
  createStubClientRecords() {
    this.clientRecords = [];
    for (let i = 0; i < 10; i++) {
      const cr = new ClientRecord();
      cr.firstName = "John" + i;
      cr.lastName = "Doe" + i;
      cr.expirationDate = new Date().toLocaleDateString();
      cr.phoneNumber = "51412345" + i;
      cr.driverLicense = "A-" + i % 9 +
        "234-" + i % 2 +
        "234" + i % 5 +
        "6-1" + i % 7;
      cr.pkid = i;
      this.clientRecords.push(cr);
    }
  }

  addOrEditClientRecord(client?: ClientRecord) {
    this.dialog.open(DialogClientRecordComponent, {
      disableClose: true,
      autoFocus: false,
      width: '40vw',
      data: {client: client}
    }).afterClosed().subscribe(data => {
        if (data) {
          if (data['isNewClient']) {
            this.clientRecords.push(data['client']);
            this.dataSource.data = this.clientRecords;
          }
        }
      }
    )
  }

  deleteClientRecord(client: any) {
    this.clientRecords = this.clientRecords.filter(cr => cr !== client);
    this.dataSource.data = this.clientRecords;
  }

}

export class ClientRecord {
  pkid: number;
  firstName: string;
  lastName: string;
  driverLicense: string;
  expirationDate: string;
  phoneNumber: string;
}
