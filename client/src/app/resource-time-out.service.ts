import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription, timer} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {Vehicle} from './api/vehicle-api.service';
import {Client} from './api/client-api.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceTimeOutService {
  private _count = 0;
  private _serviceId: string = 'resourceTimeOut-' + Math.floor(Math.random() * 10000);
  private _timeoutSeconds = 15;
  private timerSubscription: Subscription;
  private timer: Observable<number>;
  private resetOnTrigger: boolean = false;
  public timeoutExpired: Subject<number> = new Subject<number>();

  resource: Vehicle | Client;

  constructor(public dialog: MatDialog,) {
    console.log('Constructed resourceTimeOutService ' + this._serviceId);

    this.timeoutExpired.subscribe(n => {
      console.log('---timeout expired');
    });
    this.startTimer();
  }

  public startTimer(resource?: Vehicle | Client) {
    console.log('---start resource timer');
    if (resource) {
      this.resource = resource;
    }
    if (this.timerSubscription) {
      console.log('---unsubscribe resource timer');
      this.timerSubscription.unsubscribe();
    }

    this.timer = timer(this._timeoutSeconds * 1000);
    this.timerSubscription = this.timer.subscribe(n => {
      this.timerComplete(n);
    });
  }

  public stopTimer() {
    console.log('---stop resource timer');
    this.timerSubscription.unsubscribe();
  }

  public resetTimer() {
    console.log('---reset resource timer');
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timer = timer(this._timeoutSeconds * 1000);
    this.timerSubscription = this.timer.subscribe(n => {
      this.timerComplete(n);
    });
  }

  private timerComplete(n: number) {
    console.log('---timer complete resource timer');
    this.timeoutExpired.next(++this._count);
    if (this.resetOnTrigger) {
      this.startTimer();
    }
  }
}
