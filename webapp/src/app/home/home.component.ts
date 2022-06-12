import { Component, OnInit } from '@angular/core';
import { NamePercentData } from './../models/NamePercentData.model';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public partnerList: NamePercentData[] = [
    {
      name: 'VW',
      percent: 50,
    },
    {
      name: 'BMW',
      percent: 20,
    },
    {
      name: 'Fiat',
      percent: 10,
    },
  ];

  public topSuppliers: NamePercentData[] = [
    {
      name: 'Kuehne-nagel',
      percent: 30,
    },
    {
      name: 'Grammer',
      percent: 20,
    },
    {
      name: 'Audio-OHM',
      percent: 13,
    },
  ];

  public topJis: NamePercentData[] | undefined;

  public transactions: Highcharts.Options = {};
  public topFilesExchange: Highcharts.Options = {};
  public errors: Highcharts.Options = {};
  public topMessagesExchange: Highcharts.Options = {};

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.getTransactionsDataChart();
    this.getConnectionsDataChart();
    this.getEntitiesDataChart();
    this.getPartnersDataChart();

    this.getTopTransactionEntities();
  }

  groupArrayOfObjects(list: Array<any>, key: string) {
    return list.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  /** Get charts data  */

  getTransactionsDataChart() {
    this.dataService.getTransactionsChartData().subscribe((resp: any) => {
      const flatTransactions = resp.map((el: any) => ({ 'name': el._id.transactionType, dayOfYear: el._id.dayOfYear, count: el.count}));
      const groupedTransactions = this.groupArrayOfObjects(flatTransactions, 'name');
      const series = Object.values(groupedTransactions).map((el: any) => ({ name: el[0].name, type: 'areaspline', data: el.map((it: any) => it.count)})).filter(item => !!item.name) as any;
      this.transactions = {
        chart: {
          type: 'column',
          marginLeft: 0
        },
        title: {
          text: 'Transaction per type',
          align: 'left',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          }
        },
        series: series,
      }
    });
  }

  getEntitiesDataChart() {
    this.dataService.getEntityChartData().subscribe((resp) => {
      const chartData = resp.map(item => ({
        name: item._id.entityClassReference,
        y: item.count,
      }));
      this.topMessagesExchange = {
        chart: {
          plotShadow: false,
          type: 'pie'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        legend: {
          align: 'right'
        },
        title: {
          text: 'Entity class types'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        series: [{
          name: 'Brands',
          type: 'pie',
          colorByPoint: true,
          data: chartData,
        }]
      };
    });
  }

  getConnectionsDataChart() {
    this.dataService.getConnectionsChartData().subscribe((resp) => {
      const chartData = resp.map(item => ({
        name: item._id.connectionType,
        y: item.count,
      }));
      this.topFilesExchange = {
        chart: {
          plotShadow: false,
          type: 'pie'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        legend: {
          align: 'right'
        },
        title: {
          text: 'Protocol per connection log'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        series: [{
          name: 'Brands',
          type: 'pie',
          colorByPoint: true,
          data: chartData,
        }]
      };
    });
  }

  getPartnersDataChart() {
    this.dataService.getPartnersChartData().subscribe((resp) => {
      const flatPartners = resp.map((el: any) => ({ 'name': el._id.clientType, dayOfYear: el._id.dayOfYear, count: el.count}));
      const groupedPartners = this.groupArrayOfObjects(flatPartners, 'name');
      const series = Object.values(groupedPartners).map((el: any) => ({ name: el[0].name, type: 'column', data: el.map((it: any) => it.count)})).filter(item => !!item.name) as any;
      this.errors = {
        chart: {
          type: 'column',
          marginLeft: 0
        },
        title: {
          text: 'Partners/Owners',
          align: 'left',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          }
        },
        series: series,
      };
    });
  }

  /** Get top widgets data */

  getTopTransactionEntities() {
    this.dataService.getTopTransactionsEntityNames().subscribe(resp => {
      this.topJis = resp.map(el => ({ name: el._id.entityName, percent: el.totalPercent }));
    });
  }

}
