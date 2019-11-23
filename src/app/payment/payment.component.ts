import { Component, OnInit } from '@angular/core';
import { AppService } from '../core/app.service';
import { AuthService } from '../core/auth.service';

import { Router } from '@angular/router';

import {formatDate} from '@angular/common';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(public appSvc: AppService,
    public authSvc: AuthService,
    private router: Router) { 
    console.log(this.appSvc.getSelectedPlanId());
    console.log(formatDate(new Date(), 'MM/dd/yyyy', 'en') );
    const date = new Date();
    const newDate =  date.setDate(date.getDate() + 7);

    console.log(formatDate(new Date(newDate), 'MM/dd/yyyy', 'en'));
  }

  ngOnInit() {
  }

  addSubscription(){
    const planId = this.appSvc.getSelectedPlanId();
    const today = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    const date = new Date();

    
    let endDate = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    let meals_avalilable = -1;
    if(planId === 1){
      endDate = formatDate(new Date(date.setDate(date.getDate() + 7)), 'MM/dd/yyyy', 'en');
      meals_avalilable = 3;
    }else if(planId === 2){
      endDate = formatDate(new Date(date.setMonth(date.getMonth() + 1)), 'MM/dd/yyyy', 'en');
      meals_avalilable = 12;
    }

    // var newDate = new Date(date.setMonth(date.getMonth() + 1));

    this.authSvc.addSubscription(planId, today, endDate, meals_avalilable)
    .then(() =>{
      this.router.navigate(['/home']);
    })
    .catch(err =>{
      console.log(err);
    })
  }

}
