import { Component, OnInit } from '@angular/core';

import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {
  orders;
  activeOrders;
  users;
  constructor(public authSvc: AuthService, public router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.getOrders();
    this.getUsers();
  }

  getOrders(){
    this.authSvc.getOpenOrders()
    .then(data =>{
      // console.log(data);
      // data.sort((a, b) => (a.order_date < b.order_date) ? 1 : -1);
      this.activeOrders = data.length;
    })
    .catch(err =>{
      console.log(err);
    })
  }

  getUsers(){
    this.authSvc.getUsers()
    .then(res =>{
      this.users = res.length;
    })
    .catch(err =>{
      console.log(err);
    })
  }

  navigateToOrdersView(){
    this.router.navigate(['/admin-orders-view']);
  }

}
