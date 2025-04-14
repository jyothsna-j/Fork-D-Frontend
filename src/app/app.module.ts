import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChipsModule} from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { AuthInterceptor } from './Interceptor/auth.interceptor';
import { AddDishDialogComponent } from './_modals/add-dish-dialog/add-dish-dialog.component';
import { PaymentApprovalComponent } from './admin/payment-approval/payment-approval.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    RestaurantDetailComponent,
    CartComponent,
    EditRestaurantDataComponent,
    HistoryComponent,
    LiveOrdersComponent,
    LoginComponent,
    SignupComponent,
    BillingComponent,
    OrdersComponent,
    AddDishDialogComponent,
    PaymentApprovalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule, 
    MatCardModule,
    MatExpansionModule,
    MatGridListModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTableModule,
    MatSidenavModule,
    MatSelectModule,
    MatSnackBarModule,
    MatInputModule,
    MatStepperModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
