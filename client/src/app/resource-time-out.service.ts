import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription, timer} from "rxjs";
import {DialogSessionTimeOutComponent} from "./dialog-session-time-out/dialog-session-time-out.component";
import {MatDialog} from "@angular/material/dialog";
import {Vehicle} from "./api/vehicle-api.service";
import {Client} from "./api/client-api.service";

@Injectable({
  providedIn: 'root'
})
export class ResourceTimeOutService {
  private _count: number = 0;
  private _serviceId: string = 'resourceTimeOut-' + Math.floor(Math.random() * 10000);
  private _timeoutSeconds: number = 30;
  private timerSubscription: Subscription;
  private timer: Observable<number>;
  private resetOnTrigger: boolean = false;
  public timeoutExpired: Subject<number> = new Subject<number>();

  resource: Vehicle | Client;

  constructor(public dialog: MatDialog,) {
    console.log("Constructed resourceTimeOutService " + this._serviceId);

    this.timeoutExpired.subscribe(n => {
      console.log("timeoutExpired subject next.. " + n.toString());
    });
    this.startTimer();
  }

  public startTimer(resource?: Vehicle | Client) {
    console.log('start resource timer');
    if (resource) {
      this.resource = resource;
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timer = timer(this._timeoutSeconds * 1000);
    this.timerSubscription = this.timer.subscribe(n => {
      this.timerComplete(n);
    });
  }

  public stopTimer() {
    this.timerSubscription.unsubscribe();
  }

  public resetTimer() {
    console.log('reset resource timer');
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timer = timer(this._timeoutSeconds * 1000);
    this.timerSubscription = this.timer.subscribe(n => {
      this.timerComplete(n);
    });
  }

  private timerComplete(n: number) {
    this.timeoutExpired.next(++this._count);

    if (this.resetOnTrigger) {
      this.startTimer();
    }
  }
}
