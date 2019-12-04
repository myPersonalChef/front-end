//import { environment } from './../../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable()
export class AppService {

  editUserInfo: boolean = false;
  userId: string;

  selectedPlanId: number;

  userName:string;
  userEmail: string;

  constructor(
    public http: HttpClient
  ) { }

  fetchRecipes(query= "pasta"): Observable<any>{
       const url = `${environment.proxy}http://food2fork.com/api/search?key=${environment.key}&q=${query}`;
        return this.http.get(url);
  }

  sendEmail(emailId:string, fullName: string, recipeName: string, deliveryTime: any, orderId: string){
    console.log("in sendEmail...");
    this.http.post("http://localhost:3000/sendEmail", {
      name: fullName,
      email: emailId,
      recipeName,
      time: deliveryTime,
      orderId
    }).subscribe(
      data =>{
        console.log(data);
      },err=>{
        console.log(err);
      }, ()=>{
        console.log("something...");
      }
    );
  }

  /**
   * Flag for modification if user details
   */
  updateEditUserFlag(iseditable: boolean){
    this.editUserInfo = iseditable;
  }

  isEditUserInfo(): boolean{
    return this.editUserInfo;
  }

  setUserId(userId: string){
    this.userId = userId;
  }

  getUserId(): string{
    return this.userId;
  }

  setSelectedPlanId(planId: number){
    this.selectedPlanId = planId;
  }

  getSelectedPlanId(): number {
    return this.selectedPlanId;
  }

  setUserName(userName: string){
    this.userName = userName;
  }

  getUserName():string{
    return this.userName;
  }

  setUserEmail(email:string){
    this.userEmail = email;
  }

  getUserEmail():string{
    return this.userEmail;
  }
  
}
