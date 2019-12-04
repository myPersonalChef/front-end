import { Component, OnInit, Inject } from '@angular/core';

import { AuthService } from '../core/auth.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ORDER_STATUS } from '../core/const';

export interface DialogData {
  feedback: string;
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  feedback: string;
  // name: string;
  statuses = ORDER_STATUS;

  orderHistory;
  constructor(public authSvc: AuthService,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.getOrders();
  }

  getOrders(status = null){
    console.log(status , Number(status));
    this.authSvc.getCount(status ? Number(status) : null)
    .then(count =>{
      this.authSvc.getOrderHistory(count, status? Number(status): null)
      .then(data =>{
        console.log(data);
        data.sort((a, b) => (a.order_date < b.order_date) ? 1 : -1);

        this.orderHistory = data;
      })
      .catch(err => {
        console.log(err);
      });
    })
    .catch(err =>{

    })
  }

  cancelOrder(orderId: any){
    const time = new Date().valueOf();

    console.log("Canceling order id :" + orderId);
    this.authSvc.updateOrderStatus(orderId, 3, time)
    .then(res => {
      console.log("Order " + orderId +" cancelled");
      this.getOrders();
    })
    .catch(err =>{
      console.log(err);
    })
  }

  provideFeedback(recipe_id: any, feedback: any){
    console.log("Providing feedback for receipe id : " + recipe_id);
    this.authSvc.postFeedback(recipe_id, feedback)
    .then(data =>{
      console.log("Feed back posted");
      this.feedback = "";
    })
    .catch(err =>{
      console.log(err);
    })
  }

  openDialog(recipe_id): void {
    console.log("Providing feedback for receipe id : " + recipe_id);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { feedback: this.feedback}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        this.feedback = result;
        this.provideFeedback(recipe_id, this.feedback);
      }
    });
  }

  filterChanged(data){
    console.log(data);
     this.getOrders(data);
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'feedback-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}


