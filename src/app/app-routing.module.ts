import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { CartComponent } from './cart/cart.component';
import { EditRestaurantDataComponent } from './vendors/edit-restaurant-data/edit-restaurant-data.component';
import { HistoryComponent } from './vendors/history/history.component';
import { LiveOrdersComponent } from './vendors/live-orders/live-orders.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BillingComponent } from './billing/billing.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  { path: 'restaurants', component: LandingPageComponent }, 
  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'orders', component: OrdersComponent },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },

  { path: 'vendor/edit/:id', component: EditRestaurantDataComponent },
  { path: 'vendor/history', component: HistoryComponent },
  { path: 'vendor/live-orders', component: LiveOrdersComponent },
];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
