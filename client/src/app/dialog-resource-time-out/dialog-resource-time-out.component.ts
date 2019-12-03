import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ResourceTimeOutService} from '../resource-time-out.service';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-dialog-resource-time-out',
  templateUrl: './dialog-resource-time-out.component.html',
  styleUrls: ['./dialog-resource-time-out.component.scss']
})
export class DialogResourceTimeOutComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription;
  private timeoutSeconds = 20;

  constructor(
    public dialogRef: MatDialogRef<DialogResourceTimeOutComponent>,
  ) {
    console.log('+++ resource dialog created');
  }

  ngOnInit() {
    this.timerSubscription =
      timer(this.timeoutSeconds * 1000).subscribe(() => {
        console.log('+++ resource dialog expired');
        this.onNoClicked();
      });
  }

  onYesClicked() {
    this.timerSubscription.unsubscribe();
    this.dialogRef.close(true);
  }

  onNoClicked() {
    this.timerSubscription.unsubscribe();
    this.dialogRef.close(false);
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    console.log('+++ resource dialog destroyed');
    this.dialogRef = null;
  }
}
