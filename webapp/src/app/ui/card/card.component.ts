import { Component, Input, OnInit } from '@angular/core';
import { NamePercentData } from 'src/app/models/NamePercentData.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input()
  public title: string | undefined;

  @Input()
  public namePercentData: NamePercentData[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }


}
