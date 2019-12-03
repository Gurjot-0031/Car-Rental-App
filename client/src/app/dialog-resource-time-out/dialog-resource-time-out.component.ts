import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ResourceTimeOutService} from "../resource-time-out.service";
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-dialog-resource-time-out',
  templateUrl: './dialog-resource-time-out.component.html',
  styleUrls: ['./dialog-resource-time-out.component.scss']
})
export class DialogResourceTimeOutComponent implements OnInit {

  private timerSubscription: Subscription;
  private timeoutSeconds = 20;

  constructor(
    public dialogRef: MatDialogRef<DialogResourceTimeOutComponent>,
    public resourceTimeOutService: ResourceTimeOutService,
  ) { }

  ngOnInit() {
    this.timerSubscription =
      timer(this.timeoutSeconds * 1000).subscribe(() => {
        this.onNoClicked();
      });
  }

  onYesClicked() {
    this.resourceTimeOutService.resetTimer();
    this.dialogRef.close(true);
  }

  onNoClicked() {
    this.resourceTimeOutService.stopTimer();
    this.dialogRef.close(false);
  }
}
