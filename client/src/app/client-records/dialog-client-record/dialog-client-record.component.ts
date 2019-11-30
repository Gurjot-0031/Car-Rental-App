import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Client, ClientApiService} from '../../api/client-api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {timer} from 'rxjs';
import {ResourceTimeOutService} from '../../resource-time-out.service';
import {DialogResourceTimeOutComponent} from '../../dialog-resource-time-out/dialog-resource-time-out.component';

@Component({
  selector: 'app-dialog-client-record',
  templateUrl: './dialog-client-record.component.html',
  styleUrls: ['./dialog-client-record.component.scss']
})
export class DialogClientRecordComponent implements OnInit {

  isLoading: boolean;
  isModifier: boolean;
  isResourceAvailable: boolean;
  isNewClient: boolean;
  client: Client;

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  // Pattern matches A-1234-123456-12
  driverLicense = new FormControl('', [
    Validators.required,
    this.regexValidator({pattern: '^[A-Z]{1}-\\d{4}-\\d{6}-\\d{2}$', msg: 'Must match format A-1234-123456-12'})
    ]
  );
  expirationDate = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('');

  clientForm = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    driverLicense: this.driverLicense,
    phoneNumber: this.phoneNumber,
    expirationDate: this.expirationDate,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<DialogClientRecordComponent>,
    private clientApiService: ClientApiService,
    private snackBar: MatSnackBar,
    private resourceTimeOutService: ResourceTimeOutService,
    public dialog: MatDialog,
  ) {
    this.client = data.client;
  }

  async ngOnInit() {
    this.isLoading = true;
    this.isResourceAvailable = true;

    if (this.client) {
      const repeat = timer(0, 5000);
      const loop = repeat.subscribe(() => {
        this.clientApiService.isResourceAvailable(this.client).subscribe(result => {
          if (result) {
            this.setUp();
            this.isLoading = false;
            this.isResourceAvailable = true;
            loop.unsubscribe();
          } else {
            this.isResourceAvailable = false;
          }
        });
      });
    } else {
      this.isLoading = false;
      this.isModifier = false;
      this.isNewClient = true;
    }
  }

  private setUp() {
    if (this.client) {
      this.clientApiService.setStartModify(this.client).subscribe(() => {
        this.resourceTimeOutService.startTimer(this.client);
        this.resourceTimeOutService.timeoutExpired.subscribe(() => {
          this.dialog.open(DialogResourceTimeOutComponent, {
            disableClose: true,
            autoFocus: false,
            width: '40vw',
          }).afterClosed().subscribe(
            (isExtend) => {
              if (isExtend) {
                this.resourceTimeOutService.resetTimer();
              } else {
                this.resourceTimeOutService.stopTimer();
                this.onCancelClicked();
              }
            },
            (reason) => {
              this.resourceTimeOutService.stopTimer();
              this.onCancelClicked();
            }
          );
        });

        this.isNewClient = false;
        this.isModifier = true;
        this.firstName.setValue(this.client.firstName);
        this.lastName.setValue(this.client.lastName);
        this.expirationDate.setValue(this.client.expirationDate);
        this.driverLicense.setValue(this.client.driverLicense);
        this.phoneNumber.setValue(this.client.phoneNumber);
      });
    }
  }

  public regexValidator(config: any): ValidatorFn {
    return (control: FormControl) => {
      const urlRegEx: RegExp = config.pattern;
      if (control.value && !control.value.match(urlRegEx)) {
        return {
          invalidMsg: config.msg
        };
      } else {
        return null;
      }
    };
  }

  onSubmitClicked() {
    const clientRecord = new Client();

    if (this.isNewClient) {
      clientRecord.firstName = this.firstName.value;
      clientRecord.lastName = this.lastName.value;
      clientRecord.driverLicense = this.driverLicense.value;
      clientRecord.expirationDate = this.expirationDate.value;
      clientRecord.phoneNumber = this.phoneNumber.value;

      this.clientApiService.createClient(clientRecord).subscribe(() => {
        this.dialogRef.close();
      });

    } else {
      this.client.firstName = this.firstName.value;
      this.client.lastName = this.lastName.value;
      this.client.driverLicense = this.driverLicense.value;
      this.client.expirationDate = this.expirationDate.value;
      this.client.phoneNumber = this.phoneNumber.value;
      this.clientApiService.updateClient(this.client).subscribe(() => {
        this.resourceTimeOutService.stopTimer();
        this.dialogRef.close();
      });
    }
  }

  onCancelClicked() {
    this.resourceTimeOutService.stopTimer();
    if (!this.isNewClient && this.isModifier) {
      this.clientApiService.setStopModify(this.client).subscribe();
    }
    this.dialogRef.close();
  }
}
