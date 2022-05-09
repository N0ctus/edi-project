import { Component, OnInit } from '@angular/core';
import { NamePercentData } from '../models/NamePercentData.model';

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

  constructor() { }

  ngOnInit(): void {
  }

}
