import { Component, OnInit } from '@angular/core';
import { NamePercentData } from '../models/NamePercentData.model';
import { UsersService } from '../services/users.service';

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

  public topJis: NamePercentData[] = [
    {
      name: 'Jaguar-pdf',
      percent: 7,
    },
    {
      name: 'Porsche ➡ MES-sac',
      percent: 3.2,
    },
    {
      name: 'Custco ➡ Aula rosslyn',
      percent: 3,
    },
  ];

  public transactions: Highcharts.Options = {};
  public topFilesExchange: Highcharts.Options = {
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
      text: 'Top files exchange for customers per document type'
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
      data: [{
        name: 'Invoice',
        y: 14,
      }, {
        name: 'order',
        y: 86,
        selected: true,
      },]
    }]
  };
  public errors: Highcharts.Options = {
    chart: {
      type: 'column',
      marginLeft: 0
    },
    title: {
      text: 'Errors',
      align: 'left',
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 150,
      y: 100,
      floating: true,
      borderWidth: 1,
      backgroundColor: '#FFFFFF'
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5
      }
    },
    series: [{
      name: 'Connection',
      type: 'column',
      color: '#E786D7',
      data: [4, 6, 7, 2, 3, 4, 3, 5, 4, 10, 12, 9, 2, 5, 6]
    }, {
      name: 'Conversion',
      type: 'column',
      color: '#7F7FD5',
      data: [1, 3, 4, 4, 5, 7, 1, 7, 2, 4, 3, 3, 5, 7, 1]
    }]
  };
  public topMessagesExchange: Highcharts.Options = {
    chart: {
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Top messages exchanged for suppliers per document type'
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
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    series: [{
      name: 'Brands',
      type: 'pie',
      colorByPoint: true,
      data: [{
        name: 'Invoice',
        y: 60,
      }, {
        name: 'order',
        y: 40,
        selected: true,
      },]
    }]
  };

  constructor(
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.usersService.getTransactionsData().subscribe((resp: any) => {
      const flatTransactions = resp.map((el: any) => ({ 'name': el._id.transactionType, dayOfYear: el._id.dayOfYear, count: el.count}));
      const groupedTransactions = this.groupArrayOfObjects(flatTransactions, 'name');
      const series = Object.values(groupedTransactions).map((el: any) => ({ name: el[0].name, type: 'areaspline', data: el.map((it: any) => it.count)})).filter(item => !!item.name) as any;
      this.transactions = {
        chart: {
          type: 'areaspline',
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
      };
    });
  }

  groupArrayOfObjects(list: Array<any>, key: string) {
    return list.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

}
