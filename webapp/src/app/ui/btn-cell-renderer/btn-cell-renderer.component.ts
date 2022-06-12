import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-btn-cell-renderer',
  templateUrl: './btn-cell-renderer.component.html',
  styleUrls: ['./btn-cell-renderer.component.scss']
})
export class BtnCellRendererComponent implements ICellRendererAngularComp {
  refresh(params: ICellRendererParams): boolean {
    console.log('Refresh called', params);
    return true;
  }
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  btnClickedHandler() {
    this.params.clicked(this.params.value);
  }

}
