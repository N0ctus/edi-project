import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor() { }
public title="Top custumers";
public partnerList=[
  {name:"vw",percent:50},
  {name:"bmw",percent:20},
  {name:"fiat",percent:10},
  

];
  ngOnInit(): void {
  }
  

}
