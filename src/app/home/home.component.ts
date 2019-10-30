import { Component, OnInit } from '@angular/core';

import {FormControl, Validators} from '@angular/forms';

import {  AppService} from '../core/app.service';
import { DataService } from '../core/data.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recipes = [];

  errorMessage: string = '';

  itemName = new FormControl('', [Validators.required]);

  constructor(public service: AppService,
    public dataSvc: DataService) { }

  ngOnInit() {
  }

  search(){
    this.errorMessage = "";
    if(this.itemName.valid){
      console.log(this.itemName.value);
      this.dataSvc.changeLoadingStatus('loading');
      // const searchedItem = 
      this.service.fetchRecipes(this.itemName.value).subscribe((data)=>{
        this.dataSvc.changeLoadingStatus('noLoading');
        console.log(data.recipes);
        this.recipes = data.recipes;
        if(this.recipes.length === 0){
          this.errorMessage = "No Matching recipes found for your search."
          return;
        }
      }, err =>{
        console.log(err);
        this.recipes = [];
        this.errorMessage = "Something went wrong , Please try again later.";
      });
    }else{
      this.errorMessage = "Please enter recipe name";
    }

  }

  getErrorMessage() {
    return this.itemName.hasError('required') ? 'You must enter a value' :
        this.itemName.hasError('email') ? 'Not a valid email' :
            '';
  }
}
