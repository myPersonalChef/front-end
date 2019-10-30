import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';


import { AuthService } from '../core/auth.service';
import { AppService } from '../core/app.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  successMessage: string = '';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  contact = new FormControl('', [Validators.required]);

  name= new FormControl('', [Validators.required]);
  // email = '';
  // pwd = '';

  constructor( public authService: AuthService, public service: AppService) { }

  ngOnInit() {
    if(this.service.getUserId() && this.service.isEditUserInfo()){
      console.log("editing info..");
      console.log(this.service.getUserId());
      this.authService.getUserDetailsById(this.service.getUserId())
      .then(res =>{
        console.log("editing details...", res);
        this.name.setValue(res.fullName);
        this.address.setValue(res.address);
        this.contact.setValue(res.contact);
        this.email.setValue(res.email);
      })
      .catch(err =>{
        console.log(err);
      })
    }else{
      console.log("register...");
    }
  }

  tryRegister(){
    console.log("clicked register...");
    console.log(this.email.value);
    this.authService.doRegister({
      email: this.email.value,
      password: this.password.value,
    })
     .then(res => {
       console.log(res.user.uid);
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please verify your email before login.";
       // TO-DO : input adress, contact and pass while creating user
       this.authService.createUser(res.user.uid,
        this.name.value,
        this.email.value,
        this.address.value,
        this.contact.value
        )
       .then((res)=>{
        console.log(res);
       })
       .catch(err=>{
         console.log(err);
       });
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }

  getErrorMessage() {

    if (this.name.hasError('required') ||
      this.email.hasError('required') ||
      this.address.hasError('required') ||
      this.contact.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.email.hasError('email')) {
      return 'Not a valid email';
    }


    // return this.email.hasError('required') ? 'You must enter a value' :
    //     this.email.hasError('email') ? 'Not a valid email' :
    //         '';
  }

  modifyDetails(){
    console.log("Modifying...");
    if(this.name.valid && this.address.valid && this.contact.valid){
      // TO - DO : trigger update to DB
      console.log( this.name.value, this.address.value, this.contact.value);
      this.authService.updateUserDetails(this.service.getUserId(), {
        fullName: this.name.value,
        address: this.address.value,
        contact: this.contact.value
      })
      .then(res=>{
        console.log("Update success...");
        this.successMessage = "Update Successful";
        // this.service.updateEditUserFlag(false);
      })
      .catch(err=>{
        console.log("Update Error...");
        this.errorMessage = "Error while updating details.";
      })
    }
  }

  ngOnDestroy(){
    console.log("in onDestroy");
    this.service.updateEditUserFlag(false);
  }

}
