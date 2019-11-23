import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';


@Component({
  selector: 'app-admin-order-view',
  templateUrl: './admin-order-view.component.html',
  styleUrls: ['./admin-order-view.component.css']
})
export class AdminOrderViewComponent implements OnInit {
  orders;

  constructor(public authSvc: AuthService) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.getOrders();
  }

  getOrders(){
    this.authSvc.getOpenOrders()
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
    this.authSvc.updateOrderStatus(id, 2)
    .then(res=>{
      console.log("order marked as delivered");
      this.getOrders();
    })
    .catch(err =>{

    })
  }

  cancelOrder(id){
    this.authSvc.updateOrderStatus(id, 3)
    .then(res =>{
      console.log("Order marked as cancelled");
      this.getOrders();
    })
    .catch(err=>{
      console.log(err);
    });
  }

}
