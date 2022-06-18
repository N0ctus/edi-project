import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { BACKEND_URL } from 'src/app/models/Config.model';
import { ConnectionsDataTableColumnRefs, DATA_TYPES, EntitiesDataTableColumnRefs, PartnersDataTableColumnRefs, TransactionsDataTableColumnRefs } from 'src/app/models/DataTableModels';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  title = 'agGridExamples';
  gridApi: GridApi | undefined;
  count: number | undefined;
  dataType: string | undefined;
  searchQuery: string | undefined;

  loadingSize = false;
  loadingData = false;

  columnDefs = [{
    headerName: 'N/A',
    field: 'null'
  },];


  gridOptions: GridOptions = {
    pagination: true,
    rowModelType: 'infinite',
    cacheBlockSize: 20,
    paginationPageSize: 20
  };

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.loadingData = true;
      this.apiService(params).subscribe(data => {
        params.successCallback(
          data as any,
          this.count
        );
      }, () => {}, () => { this.loadingData = false })
    }
  }

  getDataTableLength() {
    this.loadingSize = true;
    let queryUrl = `${BACKEND_URL}/data/${this.dataType}/count`;
    if (this.searchQuery) {
      queryUrl += `?q=${this.searchQuery}`;
    }
    this.http.get<{ count: number }>(queryUrl).subscribe((resp) => {
      this.count = resp.count;
    }, () => {},() => { this.loadingSize = false });
  }


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      // Make sure the specified type exists to avoid errors
      if (params.get('type') !== null && DATA_TYPES.find(t => t === params.get('type'))) {
        // Set the type of data table to fetch
        this.dataType = params.get('type') as string;
      } else {
        this.dataType = DATA_TYPES[0];
      }
      // Get the table length
      this.getDataTableLength();
      // Set the column definitions
      if (this.dataType === 'connections') {
        this.columnDefs = ConnectionsDataTableColumnRefs;
      } else if (this.dataType === 'transactions') {
        this.columnDefs = TransactionsDataTableColumnRefs;
      } else if (this.dataType === 'entities') {
        this.columnDefs = EntitiesDataTableColumnRefs;
      } else if (this.dataType === 'partners') {
        this.columnDefs = PartnersDataTableColumnRefs;
      }
    });
  }

  openDataChangeAction(event: Event) {
    const type = `${(event.target as HTMLSelectElement).value}`;
    this.searchQuery = undefined;
    this.dataType = undefined;
    setTimeout(() => {
      this.router.navigate(
        ['/data-table'],
        {
          queryParams: {
            type: type,
          },
          queryParamsHandling: 'merge'
        }
      );
    }, 250);
  }

  onSearchQuery() {
    const type = `${this.dataType}`;
    this.dataType = undefined;
    setTimeout(() => {
      this.dataType = type;
      this.getDataTableLength();
    }, 250);
  }


  /**
   * This is where you call your server,
   * you can pass your start page and end page
   */
  apiService(params: IGetRowsParams) {
    if (this.searchQuery) {
      return this.http.get(`${BACKEND_URL}/data/${this.dataType}?start=${params.startRow}&limit=${params.endRow}&q=${this.searchQuery}`);
    }
    return this.http.get(`${BACKEND_URL}/data/${this.dataType}?start=${params.startRow}&limit=${params.endRow}`);
  }


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi?.sizeColumnsToFit();
    this.gridApi?.setDatasource(this.dataSource)
  }

  startDownload() {
    if (!!this.searchQuery && this.searchQuery.length > 0) {
      this.http.get(`${BACKEND_URL}/data/${this.dataType}/download?q=${this.searchQuery}`, {
        responseType: 'arraybuffer'
      }).subscribe(data => this.downloadFile(data));
    }
  }

  downloadFile(data: Response | any) {
    console.log(data)
    const blob = new Blob([data], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

}
