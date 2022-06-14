import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { BACKEND_URL } from 'src/app/models/Config.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  title = 'agGridExamples';
  gridApi: GridApi | undefined;
  count: number | undefined;
  dataType = 'connections';

  columnDefs = [
    {
      headerName: "clientName",
      field: "clientName",
    },
    {
      headerName: "connectionType",
      field: "connectionType",
    },
    {
      headerName: "createdUser",
      field: "createdUser",
    }
  ];


  gridOptions: GridOptions = {
    pagination: true,
    rowModelType: 'infinite',
    cacheBlockSize: 20,
    paginationPageSize: 20
  };

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.apiService(params).subscribe(data => {
        console.log(params);
        params.successCallback(
          data as any,
          this.count
        );
      })
    }
  }

  getDataTableLength() {
    this.http.get<{ count: number}>(`${BACKEND_URL}/data/connections/count`).subscribe((resp) => {
      this.count = resp.count;
    });
  }


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.getDataTableLength();
    console.log(this.route.snapshot.paramMap);
  }


  /**
   * This is where you call your server,
   * you can pass your start page and end page
   */
  apiService(params: IGetRowsParams) {
    return this.http.get(`${BACKEND_URL}/data/connections?start=${params.startRow}&limit=${params.endRow}`);
  }


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi?.sizeColumnsToFit();
    this.gridApi?.setDatasource(this.dataSource)
  }

}
