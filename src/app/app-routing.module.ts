import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../app/login/login.component';
import { RegisterComponent } from '../app/register/register.component';
import { HomeComponent } from '../app/home/home.component';
import {  PlansComponent } from '../app/plans/plans.component';
import { PaymentComponent } from '../app/payment/payment.component';
import { OrderHistoryComponent } from '../app/order-history/order-history.component';
import { AdminPortalComponent } from '../app/admin-portal/admin-portal.component';
import { AdminOrderViewComponent } from '../app/admin-order-view/admin-order-view.component';
import {  AdminUserViewComponent } from '../app/admin-user-view/admin-user-view.component';
import { UserPortalComponent } from '../app/user-portal/user-portal.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent},
  { path: 'plans', component: PlansComponent},
  { path: 'payment', component: PaymentComponent},
  { path: 'order-history', component: OrderHistoryComponent},
  { path: 'admin-portal', component: AdminPortalComponent},
  { path: 'admin-orders-view', component: AdminOrderViewComponent},
  { path: 'admin-users-view', component: AdminUserViewComponent},
  { path: 'user-portal', component: UserPortalComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
