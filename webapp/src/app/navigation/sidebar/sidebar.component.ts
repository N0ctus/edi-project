import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public get theme(): boolean {
    return this.auth.theme;
  }

  public set theme(value: boolean) {
    this.auth.theme = value;
  }

  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit( ): void {
  }

}
