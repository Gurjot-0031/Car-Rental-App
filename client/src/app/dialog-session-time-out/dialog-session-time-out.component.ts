import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialog-session-time-out',
  templateUrl: './dialog-session-time-out.component.html',
  styleUrls: ['./dialog-session-time-out.component.scss']
})
export class DialogSessionTimeOutComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogSessionTimeOutComponent>,
  ) { }

  ngOnInit() {
  }

  onYesClicked() {
    this.dialogRef.close(true)
  }

  onNoClicked() {
    this.dialogRef.close(false)
  }
}
