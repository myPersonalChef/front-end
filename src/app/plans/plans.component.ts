import { Component, OnInit } from '@angular/core';

import { plans } from '../core/const';

import { Router } from '@angular/router';
import { AppService } from '../core/app.service';


@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {

  plans = plans;

  constructor(private router: Router,
    public appSvc: AppService) { }

  ngOnInit() {
  }

  selectPlan(plan: any){
    console.log(plan);
    this.appSvc.setSelectedPlanId(plan.id);
    this.router.navigate(['/payment']);
  }

}
