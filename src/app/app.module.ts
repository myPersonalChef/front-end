import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {DemoMaterialModule} from '../material-module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {  AngularFireDatabaseModule} from '@angular/fire/database';

import { AuthService } from './core/auth.service';
import { AppService } from './core/app.service';
import { DataService } from './core/data.service';


const firebase = {
  apiKey: "AIzaSyD3OGdpiol6we31SZmhvkjjDLDy_lYqy20",
  authDomain: "mypersonalchef-93bd2.firebaseapp.com",
  databaseURL: "https://mypersonalchef-93bd2.firebaseio.com",
  projectId: "mypersonalchef-93bd2",
  storageBucket: "mypersonalchef-93bd2.appspot.com",
  messagingSenderId: "123996528598"
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule, ReactiveFormsModule,
    AngularFireModule.initializeApp(firebase),
   AngularFirestoreModule,
   AngularFireAuthModule,
   AngularFireDatabaseModule,
   HttpClientModule
  ],
  providers: [AuthService, AppService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
