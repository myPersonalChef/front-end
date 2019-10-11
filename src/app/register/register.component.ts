import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';


import { AuthService } from '../core/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  name= '';
  // email = '';
  // pwd = '';

  constructor( public authService: AuthService) { }

  ngOnInit() {
  }

  tryRegister(){
    console.log("clicked register...");
    console.log(this.email.value);
    this.authService.doRegister({email: this.email.value, password: this.password.value})
     .then(res => {
       console.log(res);
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please verify your email before login.";
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

}
