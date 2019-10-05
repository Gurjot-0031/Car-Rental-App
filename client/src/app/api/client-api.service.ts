import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientApiService {

  // Because we don't have a database yet
  clientRecords: Client[];

  constructor() {
    this.createStubClientRecords();
  }

  createStubClientRecords() {
    this.clientRecords = [];
    for (let i = 0; i < 10; i++) {
      const cr = new Client();
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

  public getAllClientRecords(): Client[] {
    return this.clientRecords;
  }

  public addClient(client: Client) {
    this.clientRecords.push(client);
  }

  public deleteClient(client: Client) {
    this.clientRecords = this.clientRecords.filter(cr => cr !== client);
  }

  public getClientByDriverLicense(driverLicense: string): Client {
    return this.clientRecords.filter(c => c.driverLicense === driverLicense)[0];
  }
}

export class Client {
  pkid: number;
  firstName: string;
  lastName: string;
  driverLicense: string;
  expirationDate: string;
  phoneNumber: string;
}
