import { Component, OnInit } from '@angular/core';

import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

import { DataService } from "../core/data.service";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit {

  orderLeft = 0;
  startDate;
  endDate;
  daysLeft;
  isSubscriptionValid: boolean = false;

  orders = [];

  constructor( public authSvc: AuthService,
    public router: Router,
    public dataSvc: DataService) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.authSvc.getOpenOrders()
    .then(data =>{
      this.orders = data;
    })
    .catch(err =>{
      console.log(err);
    });


    this.authSvc.getSubscriptionDetails()
    .then(data =>{
      console.log(data);
      if(this.checkSubscriptionValidity(data.subscription_end_timestamp, data.meals_avalilable)){
        this.isSubscriptionValid = true;
        this.orderLeft = data.meals_avalilable;
        this.startDate = data.subscription_start_timestamp;
        this.endDate = data.subscription_end_timestamp;
        this.daysLeft = Math.round(this.calculateDaysLeftinSubscription(data.subscription_end_timestamp));
      }else{
        this.isSubscriptionValid = false;

        // show invalid subscription
      }
      
    })
    .catch(err =>{
      console.log(err);
    })
  }

  checkSubscriptionValidity(endDate, ordersLeft){
     // if end date in past


     // if no orders left


     if(this.isEndDateinPast(endDate) || ordersLeft == 0){
      return false;
     }

     return true;
  }


  isEndDateinPast(subEndDate){
    const date = new Date();

    const endDate = new Date(subEndDate);
console.log(date , endDate);
    if(endDate < date){
        return true;
    }else{
        return false;
    }
  }

  calculateDaysLeftinSubscription(subEndDate){
    const today = new Date(); 
    const endDate = new Date(subEndDate); 
      
    // To calculate the time difference of two dates 
    var Difference_In_Time = endDate.getTime() - today.getTime(); 
      
    // To calculate the no. of days between two dates 
    return Difference_In_Time / (1000 * 3600 * 24);
  }

  navigateToHome(){
    this.authSvc.getAvailableMeals()
    .then(res =>{
      console.log(res , typeof res);
      if(res > 0){
        this.router.navigate(['/home']);
      }else{
        // show pop up for subscription
        alert("You do not have enough meals left to place this order. Please subscribe.");
      }
    })
    .catch(err=>{
      console.log(err);
    })
    
  }

  navigateToSubscrpitions(){
    this.router.navigate(['/plans']);
  }

  navigateToOrdersView(){
    this.router.navigate(['/order-history']);
  }

  cancelSubscrpition(){
    this.authSvc.cancelSubscription()
    .then(data => {
      console.log("subscription cancelled...");
      this.authSvc.doLogout()
      .then(data =>{
        this.dataSvc.changeLoginStatus("loggedOut");
        this.router.navigate(['/login']);
      })
      .catch(err =>{
        console.log(err);
      })
      
    })
    .catch(err=>{
      console.log(err);
    })
  }


  modifySubscrpition(){
    console.log('clicked modify subscription...');
  }


}

@Component({
  selector: 'subscribe-overview-example-dialog',
  templateUrl: 'subscribeHelp-dialog.html',
})
export class SubscribeDialog {

  constructor(
    public dialogRef: MatDialogRef<SubscribeDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
