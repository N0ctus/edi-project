import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userEmail : string = '';
  userPassword : string = '';

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {

  }

  login(){
    this.authService.validate(this.userEmail, this.userPassword).subscribe(response => {
      console.log(response);
      this.authService.setUserInfo({'user' : response.user});
      this.router.navigate(['home']);
    });
  }

}
