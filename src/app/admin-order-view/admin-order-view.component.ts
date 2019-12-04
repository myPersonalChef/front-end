import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AppService } from '../core/app.service';

import {formatDate} from '@angular/common';


@Component({
  selector: 'app-admin-order-view',
  templateUrl: './admin-order-view.component.html',
  styleUrls: ['./admin-order-view.component.css']
})
export class AdminOrderViewComponent implements OnInit {
  orders;

  constructor(public authSvc: AuthService, public appSvc: AppService) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.getOrders();
  }

  getOrders(){
    this.authSvc.getOpenOrders(0 , true)
    .then(data =>{
      console.log(data);
      data.sort((a, b) => (a.order_date < b.order_date) ? 1 : -1);
      this.orders = data;
    })
    .catch(err =>{
      console.log(err);
    })
  }

  markDelivered(id){
    console.log("MArkingn order as delivered :" + id);
    const deliveryTime = new Date().valueOf();
    this.authSvc.updateOrderStatus(id, 2, deliveryTime)
    .then(res=>{
      console.log("order marked as delivered");
      this.authSvc.getOrderDetailsById(id)
      .then(data =>{
        console.log(data);
        console.log("ordered by id... ", data.ordered_by);
        this.authSvc.getUserDetailsById(data.ordered_by)
        .then(userData =>{
          console.log(userData);
          this.authSvc.getRecipeDetailsById(data.receipe_id)
          .then(recipeData =>{
            this.appSvc.sendEmail(userData.email , userData.fullName, recipeData.title, formatDate(deliveryTime, 'MM/dd/yyyy', 'en'), id);
            this.getOrders();
          })
          .catch(err =>{
            console.log("error while gettting recipe data by id... ", err);
          })
          
        })
        .catch(err =>{
          console.log("err while getting user details", err);
        })
      })
      .catch(err =>{
        console.log(err);
      })
      // this.appSvc.sendEmail(this.appSvc.getUserEmail() , this.appSvc.getUserName());
      
    })
    .catch(err =>{

    })
  }

  cancelOrder(id){
    const time = new Date().valueOf();

    this.authSvc.updateOrderStatus(id, 3, time)
    .then(res =>{
      console.log("Order marked as cancelled");
      this.getOrders();
    })
    .catch(err=>{
      console.log(err);
    });
  }

}
