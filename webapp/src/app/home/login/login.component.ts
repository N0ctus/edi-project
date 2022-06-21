import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName : string = '';
  userPassword : string = '';

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {

  }

  login(){
    this.authService.login(this.userName, this.userPassword).subscribe(() => {
      this.router.navigate(['']);
      this.authService.username = this.userName;
    });
  }

}
