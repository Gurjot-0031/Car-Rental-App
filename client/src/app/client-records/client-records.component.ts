import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-records',
  templateUrl: './client-records.component.html',
  styleUrls: ['./client-records.component.scss']
})
export class ClientRecordsComponent implements OnInit {

  isLoading: boolean;
  clientRecords: ClientRecord[];
  displayedColumns: string[] = ['lastName', 'firstName', 'driverLicense', 'expirationDate', 'phoneNumber', 'actions'];

  constructor() { }
  ngOnInit() {
    this.isLoading = true;
    this.createStubClientRecords();
    this.isLoading = false;
  }

  // This method is to be replaced when we implement concurrency
  createStubClientRecords() {
    this.clientRecords = [];
    for (let i = 0; i < 25; i++) {
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


  editClientRecord(client: ClientRecord) {
    console.log(client);
  }

  deleteClientRecord(client: any) {
    this.clientRecords = this.clientRecords.filter(cr => cr !== client);
  }

  createNewClient() {
    alert("This will create a new usewr!!!");
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
