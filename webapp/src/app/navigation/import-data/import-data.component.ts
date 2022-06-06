import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ExpectedCSVColumns, getKeyName } from 'src/app/models/ExpectedCsvColumns.model';
import { CsvUploadService } from 'src/app/services/csv-upload.service';
import { CSVToArray } from 'src/app/utils/csv-to-array';

// https://sebhastian.com/javascript-csv-to-array

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {

  public fileError = '';

  public fileInfo = '';

  public fileWarning = '';

  public fileSuccess = '';

  public loading = false;

  public fileName = 'Select a file';

  public progress = 0;

  public parsedCSV: string[][] | null = null;

  public ExpectedCSVColumns = ExpectedCSVColumns;

  public expectedCsvColumns: ExpectedCSVColumns | null = null;

  private fileReader = new FileReader();

  private inputFile: File | undefined = undefined;

  constructor(
    private csvUploadService: CsvUploadService,
  ) {
    this.fileReader.onload = ((ev) => {
      this.loading = false;
      this.parsedCSV = CSVToArray(ev.target?.result as string);
      console.log(this.parsedCSV);
      if (this.parsedCSV.length > 0 && this.parsedCSV[0].length === this.expectedCsvColumns) {
        this.fileInfo = "The file is valid and ready to be imported!";
      } else {
        this.fileWarning = `The CSV file is supposed to have ${this.expectedCsvColumns} columns but we found ${this.parsedCSV[0].length}. Please check your file.`;
        this.parsedCSV = null;
      }
    });
  }

  ngOnInit(): void {
  }

  public loadCSV(event: Event) {
    if ((event.target as HTMLInputElement).files?.[0]) {
      this.resetCsvLoading();
      const inputFile = (event.target as HTMLInputElement).files?.[0];
      this.fileName = (event.target as HTMLInputElement).files?.[0].name as string;
      this.inputFile = inputFile;
      this.fileReader.readAsText(inputFile as any);
    } else {
      this.fileName = 'Select a file';
    }
  }

  public dataTypeChange(event: Event) {
    this.expectedCsvColumns = parseInt((event.target as HTMLSelectElement).value, 10);
  }

  public startUpload() {
    if (this.inputFile !== undefined) {
      this.csvUploadService.uploadFile(
        this.fileName,
        this.inputFile,
        this.getOperationType(),
      ).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / (event?.total || 1 ) * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            this.fileSuccess = 'The file has been successfully uploaded!';
            setTimeout(() => {
              this.progress = 0;
              this.loading = false;
            }, 1500);
        }
      });
    }
  }

  private getOperationType(): string {
    let operationType = '';
    switch (this.expectedCsvColumns) {
      case ExpectedCSVColumns.Connections:
        operationType = 'connections';
        break;
      case ExpectedCSVColumns.Entity:
        operationType = 'entities';
        break;
      case ExpectedCSVColumns.Partners:
        operationType = 'partners';
        break;
      case ExpectedCSVColumns.Transactions:
        operationType = 'transactions';
        break;
      default:
        break;
    }
    return operationType;
  }

  private resetCsvLoading() {
    this.loading = true;
    this.fileError = '';
    this.fileInfo = '';
    this.fileWarning = '';
    this.fileSuccess = '';
  }

}
