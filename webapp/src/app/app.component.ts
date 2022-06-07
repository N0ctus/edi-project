import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  constructor(
    private auth: AuthService
  ) {
  }

  async ngOnInit() {
  }

  async login() {
  }

  async logout() {
  }
}
