import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent, DeleteAccountDialog } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {DemoMaterialModule} from '../material-module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {  AngularFireDatabaseModule} from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { AuthService } from './core/auth.service';
import { AppService } from './core/app.service';
import { DataService } from './core/data.service';
import { PlansComponent } from './plans/plans.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DialogOverviewExampleDialog } from './order-history/order-history.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AdminOrderViewComponent } from './admin-order-view/admin-order-view.component';
import { AdminUserViewComponent } from './admin-user-view/admin-user-view.component';
import { UserPortalComponent } from './user-portal/user-portal.component';



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
    HomeComponent,
    PlansComponent,
    PaymentComponent,
    OrderHistoryComponent,
    DialogOverviewExampleDialog,
    AdminPortalComponent,
    AdminOrderViewComponent,
    AdminUserViewComponent,
    UserPortalComponent,
    DeleteAccountDialog
  ],
  entryComponents: [DialogOverviewExampleDialog, DeleteAccountDialog],
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
  providers: [AuthService, AppService, DataService, AngularFireStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
