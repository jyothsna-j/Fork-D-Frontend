import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { CartComponent } from './cart/cart.component';
import { EditRestaurantDataComponent } from './vendors/edit-restaurant-data/edit-restaurant-data.component';
import { HistoryComponent } from './vendors/history/history.component';

const routes: Routes = [
  { path: 'restaurants', component: LandingPageComponent }, 
  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },

  { path: 'vendor/edit/:id', component: EditRestaurantDataComponent },
  { path: 'vendor/history', component: HistoryComponent },
];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
