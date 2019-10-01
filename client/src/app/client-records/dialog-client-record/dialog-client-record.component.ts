import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ClientRecord} from "../client-records.component";

@Component({
  selector: 'app-dialog-client-record',
  templateUrl: './dialog-client-record.component.html',
  styleUrls: ['./dialog-client-record.component.scss']
})
export class DialogClientRecordComponent implements OnInit {

  isNewClient: boolean;
  client: ClientRecord;

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
  ) {
    this.client = data['client'];

    if (this.client) {
      this.isNewClient = false;
      this.firstName.setValue(this.client.firstName);
      this.lastName.setValue(this.client.lastName);
      this.expirationDate.setValue(this.client.expirationDate);
      this.driverLicense.setValue(this.client.driverLicense);
      this.phoneNumber.setValue(this.client.phoneNumber);
    } else {
      this.isNewClient = true;
    }
  }

  ngOnInit() {
  }

  public regexValidator(config: any): ValidatorFn {
    return (control: FormControl) => {
      let urlRegEx: RegExp = config.pattern;
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
    const clientRecord = new ClientRecord();

    if (this.isNewClient) {
      clientRecord.firstName = this.firstName.value;
      clientRecord.lastName = this.lastName.value;
      clientRecord.driverLicense = this.driverLicense.value;
      clientRecord.expirationDate = this.expirationDate.value;
      clientRecord.phoneNumber = this.phoneNumber.value;

      this.dialogRef.close({
        isNewClient: this.isNewClient,
        client: clientRecord
      })
    } else {
      this.client.firstName = this.firstName.value;
      this.client.lastName = this.lastName.value;
      this.client.driverLicense = this.driverLicense.value;
      this.client.expirationDate = this.expirationDate.value;
      this.client.phoneNumber = this.phoneNumber.value;
      this.dialogRef.close()
    }



  }

  onCancelClicked() {
    this.dialogRef.close()
  }
}
