import { Component, OnInit } from '@angular/core';

import { AuthService } from '../core/auth.service'
import {FormControl, Validators} from '@angular/forms';

import { Router, Params } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor( public authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  tryLogin(){
    console.log("Login clicked...");
    this.authService.doLogin({email: this.email.value, password: this.password.value})
    .then(res => {
      // this.router.navigate(['/home']);
      console.log("Login Success...");
      this.router.navigate(['/home']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    })
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }
}
