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

  constructor(
    public http: HttpClient
  ) { }

  fetchRecipes(query= "pasta"): Observable<any>{
       const url = `${environment.proxy}http://food2fork.com/api/search?key=${environment.key}&q=${query}`;
        return this.http.get(url);
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
}