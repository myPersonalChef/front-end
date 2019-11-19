import { Component, OnInit } from '@angular/core';

import { DataService } from "./core/data.service";
import { AuthService } from './core/auth.service';
import {  AppService} from './core/app.service';

import { Router } from '@angular/router';

import { plans } from './core/const';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dummy';
  userName: string;
  loggedIn: boolean = false;

  showLoader: boolean = false;


  constructor(private dataSvc: DataService, 
    private authService: AuthService,
    private service: AppService,
    private router: Router) {
      if (!authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    }


  ngOnInit() {
    this.authService.createPlans(plans);
    this.dataSvc.currentMessage.subscribe(message => {
      if(message && message.length){
        this.userName = message;
      }
    });

    this.dataSvc.currentLoginStatus.subscribe(status => {
      if(status && status.length ){
        if(status === "loggedIn"){
          this.loggedIn = true;
        }else{
          this.loggedIn = false;
        }
      }
    });

    this.dataSvc.loadingStatus.subscribe(status => {
      if(status && status.length > 0 ){
        if(status === "noLoading"){
          this.showLoader = false;
        }else{
          this.showLoader = true;
        }
      }
    });
  }

  signout(){
    this.authService.doLogout()
    .then((res)=>{
      console.log("Logout success");
      this.dataSvc.changeLoginStatus("loggedOut");
      this.router.navigate(['/login']);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  modifyUserProfile(){
    this.service.updateEditUserFlag(true);
    this.router.navigate(['/register']);
  }


}
