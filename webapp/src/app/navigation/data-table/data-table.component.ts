import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { Connection } from 'src/app/models/Connection.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  columnDefs: ColDef[] = [
    { field: 'clientName', sortable: true, filter: true, },
    { field: 'comment', sortable: true, filter: true, },
    { field: 'connectionType', sortable: true, filter: true, },
    { field: 'createdUser', sortable: true, filter: true, },
    { field: 'creationDate', sortable: true, filter: true, },
    { field: 'lastModificationDate', sortable: true, filter: true, },
    { field: 'lastUser', sortable: true, filter: true, },
    { field: '_id', sortable: true, filter: true, },
  ];

  rowData: Connection[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getConnectionsRawData().subscribe((response) => {
      console.log(response);
      this.rowData = Object.values(response);
    });
  }

}
