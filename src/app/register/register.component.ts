import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';


import { AuthService } from '../core/auth.service';
import { AppService } from '../core/app.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from "../core/data.service";

import { Router } from '@angular/router';




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

  constructor( public authService: AuthService, public service: AppService,
    public dialog: MatDialog,
    public dataSvc: DataService,
    public router: Router) { }

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


  deleteAccount(){
    this.authService.deleteUserAccount()
    .then(res =>{
      this.dataSvc.changeLoginStatus("loggedOut");
      this.router.navigate(['/login']);
    })
    .catch(err =>{
      console.log(err);
    })

  }

  openDialog(): void {
    console.log("dialog...");
   // console.log("Providing feedback for receipe id : " + recipe_id);
    const dialogRef = this.dialog.open(DeleteAccountDialog, {
      width: '250px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        console.log("Trigger svc here...");
        this.deleteAccount();
        // this.feedback = result;
        // this.provideFeedback(recipe_id, this.feedback);
      }
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'deleteAccount-dialog.html',
})
export class DeleteAccountDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteAccountDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
