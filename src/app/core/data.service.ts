/** 
 * Data sharing for unrelated components.
 * components with no parent child relationship
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  private loginCheckSource = new BehaviorSubject('loggedOut');
  currentLoginStatus = this.loginCheckSource.asObservable();

  private loadingStatusSource = new BehaviorSubject('noLoading');
  loadingStatus = this.loadingStatusSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeLoginStatus(status: string){
    this.loginCheckSource.next(status);
  }

  changeLoadingStatus(status: string){
    this.loadingStatusSource.next(status);
  }

}