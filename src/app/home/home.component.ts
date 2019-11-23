import { Component, OnInit } from '@angular/core';

import {FormControl, Validators} from '@angular/forms';

import {  AppService} from '../core/app.service';
import { DataService } from '../core/data.service';
import { AuthService } from '../core/auth.service';


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
    public dataSvc: DataService,
    public authSvc: AuthService) { }

  ngOnInit() {
  }

  search(){
    this.errorMessage = "";
    if(this.itemName.valid){
      console.log(this.itemName.value);
      this.dataSvc.changeLoadingStatus('loading');
      this.authSvc.getRecipesBySearchTerm(this.itemName.value)
      .then((data)=>{
        this.dataSvc.changeLoadingStatus('noLoading');
        // console.log(data);
        
        
        if(data.length === 0){
          this.errorMessage = "No Matching recipes found for your search."
          return;
        }
        else{
          data.forEach((recipe)=>{
            this.authSvc.getStorageUrl(recipe.recipe_id)
            .then((url)=>{
              recipe.image_url = url;
            })
            .catch(err=>{
              console.log(err);
            })
          })
        }

        this.recipes = data;
      })
      .catch(err=>{
        console.log(err);
        this.recipes = [];
        this.errorMessage = "Something went wrong , Please try again later.";
      })
    }else{
      this.errorMessage = "Please enter recipe name";
    }

  }

  getErrorMessage() {
    return this.itemName.hasError('required') ? 'You must enter a value' :
        this.itemName.hasError('email') ? 'Not a valid email' :
            '';
  }

  placeOrder(recipe_id: string){
    console.log(recipe_id);
    this.authSvc.addOrder(recipe_id)
    .then((data)=>{
      console.log(data);
      this.authSvc.updateAvailableMeals()
      .then( data =>{
        
      })
      .catch(err=>{

      })
    })
    .catch(err=>{
      console.log(err);
    })
  }
}
