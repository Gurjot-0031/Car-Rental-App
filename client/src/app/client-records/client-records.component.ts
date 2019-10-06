import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogClientRecordComponent} from "./dialog-client-record/dialog-client-record.component";
import {MatTableDataSource} from "@angular/material/table";
import {Client, ClientApiService} from "../api/client-api.service";

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
    public clientApiService: ClientApiService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource<Client>();
    this.dataSource.data = this.clientApiService.getAllClientRecords();
    this.isLoading = false;
  }


  addOrEditClientRecord(client?: Client) {
    this.dialog.open(DialogClientRecordComponent, {
      disableClose: true,
      autoFocus: false,
      width: '40vw',
      data: {client: client}
    }).afterClosed().subscribe(data => {
        if (data) {
          if (data['isNewClient']) {
            this.clientApiService.addClient(data['client']);

            // this should be replace by observable style pattern. The datasource should listen to record changes
            this.dataSource.data = this.clientApiService.getAllClientRecords();
          }
        }
      }
    )
  }

  deleteClientRecord(client: Client) {
    this.clientApiService.deleteClient(client)
    this.dataSource.data = this.clientApiService.getAllClientRecords();
  }
}
