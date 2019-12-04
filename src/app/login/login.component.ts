import { Component, OnInit } from '@angular/core';

import { AuthService } from '../core/auth.service'
import {FormControl, Validators} from '@angular/forms';

import { Router, Params } from '@angular/router';

import { User } from '../core/interfaces';

import { DataService } from "../core/data.service";
import { AppService } from '../core/app.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message:string;


  errorMessage: string = '';
  successMessage: string = '';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor( public authService: AuthService,
    private router: Router,
    private dataSvc: DataService,
    private appService: AppService
    ) { }

  ngOnInit() {

      this.dataSvc.currentMessage.subscribe(message => this.message = message);
    
  }

  tryLogin(){
    if(this.email.invalid ){
      this.errorMessage = "Please enter valid email";
      return;
    }

    if(this.password.invalid){
      this.errorMessage = "Please enter password";
      return;
    }
    console.log("Login clicked...");
    this.authService.doLogin({email: this.email.value, password: this.password.value})
    .then(res => {
      console.log("Login Success...");
      console.log(res);
      this.appService.setUserId(res.user.uid);
      this.authService.getUserDetailsById(res.user.uid)
      .then((data: User)=>{
        console.log(data.fullName);
        
        if(data.userType === 0){
          this.dataSvc.changeMessage("Admin");
          this.dataSvc.changeLoginStatus("loggedIn");
          this.router.navigate(['/admin-portal']);
          return;
        }
        this.appService.setUserName(data.fullName);
        this.appService.setUserEmail(this.email.value);
        this.dataSvc.changeMessage(data.fullName.split(" ")[0]);
        this.dataSvc.changeLoginStatus("loggedIn");
        // this.router.navigate(['/plans']);

        // if subscribed , go to home
        // else show plans screen
        this.authService.isSubscribed(res.user.uid)
        .then((data) =>{
          if(data){
            // this.router.navigate(['/home']);
            this.router.navigate(['/user-portal']);
          }else{
            this.router.navigate(['/plans']);
          }
        })
        .catch(err =>{
          console.log("Error while checking subscription...");
        })

      })
      .catch((err)=>{
        console.log("Error while login...");
      })
     
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

  signInWithGoogleAccount(){
    this.authService.signInWithGoogle()
    .then(res=>{
      console.log(res);
      // this.appService.setUserId(res.uid);

      this.dataSvc.changeMessage(res.displayName.split(" ")[0]);
      this.dataSvc.changeLoginStatus("loggedIn");
      this.router.navigate(['/home']);
    })
    .catch(err =>{
      console.log(err);
    });
  }
}
