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
import { PaymentApprovalComponent } from './admin/payment-approval/payment-approval.component';
import { authGuard } from './auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AllOrdersComponent } from './admin/all-orders/all-orders.component';
import { AllUsersComponent } from './admin/all-users/all-users.component';

const routes: Routes = [
  { path: 'restaurants', component: LandingPageComponent }, 
  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: CartComponent},
  { path: 'billing', component: BillingComponent},
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard],  data: { role: 'CUSTOMER' } },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },

  { path: 'vendor/edit', component: EditRestaurantDataComponent, canActivate: [authGuard],  data: { role: 'VENDOR' } },
  { path: 'vendor/history', component: HistoryComponent, canActivate: [authGuard],  data: { role: 'VENDOR' } },
  { path: 'vendor/live-orders', component: LiveOrdersComponent, canActivate: [authGuard],  data: { role: 'VENDOR' } },

  { path: 'admin/approve', component: PaymentApprovalComponent, canActivate: [authGuard],  data: { role: 'ADMIN' }},
  { path: 'admin/orders', component: AllOrdersComponent, canActivate: [authGuard], data: { role: 'ADMIN' }},
  { path: 'admin/users', component: AllUsersComponent },

  { path: 'unauthorized', component: UnauthorizedComponent }, 
  { path: 'forbidden', component: ForbiddenComponent }, 
];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
