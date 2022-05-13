import { Component, Input, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;

  @Input()
  public title: string = '';

  @Input()
  public chartOptions: Highcharts.Options = {};

  constructor() { }

  ngOnInit(): void {
  }

}
