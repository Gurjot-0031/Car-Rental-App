import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResourceTimeOutService} from "../resource-time-out.service";

@Injectable({
  providedIn: 'root'
})
export class ClientApiService {

  constructor(
    private http: HttpClient,
    private resourceTimeoutService: ResourceTimeOutService,
  ) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>('/api/client');
  }

  getClient(client: Client): Observable<Client> {
    return this.http.get<Client>('/api/client/' + encodeURIComponent(client.pkid));
  }

  createClient(client: Client) {
    return this.http.post('/api/client', client);
  }

  updateClient(client: Client) {
    return this.http.put('/api/client', client);
  }

  deleteClient(client: Client) {
    return this.http.delete('/api/client/' + encodeURIComponent(client.pkid));
  }

  getClientByDriverLicense(driverLicense: string) {
    return this.http.get<Client>('/api/client/driver-license/' + encodeURIComponent(driverLicense));
  }

  isResourceAvailable(client: Client): Observable<boolean> {
    return this.http.get<boolean>('/api/client/' + encodeURIComponent(client.pkid) + '/is-available');
  }

  setStartModify(client: Client) {
    this.resourceTimeoutService.startTimer();
    return this.http.post('/api/client/' + encodeURIComponent(client.pkid) + '/start-modify', client);
  }

  setStopModify(client: Client) {
    this.resourceTimeoutService.stopTimer();
    return this.http.post('/api/client/' + encodeURIComponent(client.pkid) + '/stop-modify', client);
  }
}

export class Client {
  pkid: number;
  firstName: string;
  lastName: string;
  driverLicense: string;
  expirationDate: string;
  phoneNumber: string;
  active: number;
  version: number;
}
