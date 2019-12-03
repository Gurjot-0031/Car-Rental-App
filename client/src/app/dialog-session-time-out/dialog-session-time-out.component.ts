import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-dialog-session-time-out',
  templateUrl: './dialog-session-time-out.component.html',
  styleUrls: ['./dialog-session-time-out.component.scss']
})
export class DialogSessionTimeOutComponent implements OnInit {

  private timer$: Subscription;
  private timeoutSeconds = 20;

  constructor(
    public dialogRef: MatDialogRef<DialogSessionTimeOutComponent>,
  ) { }

  ngOnInit() {
    this.timer$ =
      timer(this.timeoutSeconds * 1000).subscribe(() => {
        this.onNoClicked();
      });
  }

  onYesClicked() {
    this.timer$.unsubscribe();
    this.dialogRef.close(true);
  }

  onNoClicked() {
    this.timer$.unsubscribe();
    this.dialogRef.close(false);
  }
}
