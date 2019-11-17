import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogClientRecordComponent} from "./dialog-client-record/dialog-client-record.component";
import {MatTableDataSource} from "@angular/material/table";
import {Client, ClientApiService} from "../api/client-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-client-records',
  templateUrl: './client-records.component.html',
  styleUrls: ['./client-records.component.scss']
})
export class ClientRecordsComponent implements OnInit {

  isLoading: boolean;
  dataSource: MatTableDataSource<Client>;
  displayedColumns: string[] = ['lastName', 'firstName', 'driverLicense', 'expirationDate', 'phoneNumber', 'actions'];

  constructor(
    public dialog: MatDialog,
    public clientApiService: ClientApiService,
    private snackBar: MatSnackBar,) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Client>();
    this.refreshClientList();
  }

  refreshClientList() {
    this.isLoading = true;
    this.clientApiService.getAllClients().subscribe(result => {
      this.dataSource.data = result.filter(c => c.active === 1);
      this.isLoading = false;
    });
  }

  addOrEditClientRecord(client?: Client) {
    this.dialog.open(DialogClientRecordComponent, {
      disableClose: true,
      autoFocus: false,
      width: '40vw',
      data: {client: client}
    }).afterClosed().subscribe(() => {
        this.refreshClientList();
      }
    )
  }

  deleteClientRecord(client: Client) {
    this.clientApiService.isResourceAvailable(client).subscribe(result => {
      if (result) {
        this.clientApiService.deleteClient(client).subscribe(() => {
          this.refreshClientList()
        });
      } else {
        this.snackBar.open('Resource unavailable. Try again later', '', {duration: 5000});
      }
    })
  }
}
