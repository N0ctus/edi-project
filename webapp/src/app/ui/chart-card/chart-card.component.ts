import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnChanges {

  Highcharts: typeof Highcharts = Highcharts;

  public updated = false;

  @Input()
  public title: string = '';

  @Input()
  public chartOptions: Highcharts.Options | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['chartOptions']) {
      this.updated = true;
    }
  }
}
