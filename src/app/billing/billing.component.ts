import { Component, inject, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import _ from "lodash";
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { DropLocations, DropPoint } from '../_models/address';
import { UEngageServiceService } from '../services/u-engage-service.service';
import { RestaurantService } from '../services/restaurant.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {

  private _snackBar = inject(MatSnackBar);
  loading = false;

  //user values
  userName: any;
  selectedPickup: any;

  //restaurant values
  restaurantId: any;
  isLoggedIn: boolean = false
  address: FormGroup;
  totalPrice: number = 0;
  itemValues: any;
  restaurantAddress: any;

  //
  dropLocations: DropPoint[] = DropLocations;
  deliveryCharge: any = 0;
  isDeliverable : boolean | null = null;
  isOrderApprovable! : boolean;

  constructor( private userService: UserService, private fb: FormBuilder, private router: Router, private restaurantService: RestaurantService,
                private orderService: OrderService, private uEngageService: UEngageServiceService) {
    this.address = this.fb.group({
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.restaurantId = history.state[0];
    this.itemValues = _.pickBy(history.state[1], item => item.quantity > 0);

    this.isLoggedIn = this.userService.isLoggedIn();
    this.userName = this.userService.getUsername();

    this.userService.getToggleStatus().subscribe({
      next: (status) => {
        this.isOrderApprovable = status.data;
      },
      error: () => alert('Failed to fetch status')
    });
    
    this.restaurantService.getRestaurantAddress(this.restaurantId).subscribe({
      next : (response) =>{
        if(response.body){
          this.restaurantAddress = response.body.data;
        }
      },
      error:(error) => {
        console.log(error);
        this._snackBar.open(error.error.message, 'Dismiss', {duration: 3000})
      }
    })
  } 

  setTotalPrice(data: number) {
    this.totalPrice = data;
  }

  checkDeliverability(address: any){
    this.loading = true;
    this.selectedPickup = this.dropLocations.find(loc => loc.key === address.value);
    if(this.selectedPickup){
      console.log(this.restaurantAddress)
      var payload = {
        store_id: this.restaurantId,
        pickupDetails: {
          latitude: this.restaurantAddress.latitude,
		      longitude: this.restaurantAddress.longitude
        },
        dropDetails: {
          latitude: this.selectedPickup.lat,
          longitude: this.selectedPickup.lng
        }
      }
      this.uEngageService.getServiceability(payload).subscribe({
        next:(response) => {
          if(response.body){
            this.loading = false;
            this.deliveryCharge = response.body.payouts.total;
            this.isDeliverable=true
          }
        },
        error:(error) => {
          this.loading = false;
          this.isDeliverable=false;
          console.log(error);
          this._snackBar.open(error.message, 'Dismiss', {duration: 3000})
        }
      })
    }
  }

  paymentMade(){
    console.log(this.restaurantAddress);
    const orderDate = new Date().toISOString().slice(0, 19); // "yyyy-MM-ddTHH:mm:ss"
    var order = {
      user: {
        userId: this.userService.getUserId()
      },
      restaurant: {
        restaurantId: this.restaurantId
      },
      amount: this.totalPrice,
      orderStatus: "PAYMENT_APPROVAL_PENDING",
      orderDate: orderDate,
      items: itemsConverter(this.itemValues),
      pickupAddress: {
        address: this.restaurantAddress.address,
        latitude: this.restaurantAddress.latitude,
		    longitude: this.restaurantAddress.longitude,
        contactNumber: this.restaurantAddress.contactNumber
      },
      dropAddress: {
        address: this.selectedPickup.name,
        latitude: this.selectedPickup.lat,
		    longitude: this.selectedPickup.lng
      }
    }
    console.log(order);
    this.orderService.postOrder(order).subscribe({
      next: (response) => {
        if(response.body===null){
          this._snackBar.open('Error inserting order', 'Dismiss', {duration: 3000})
        }
        else{
          this.router.navigate(['/orders']);
        }
      },
      error: (error: any) => {
        this._snackBar.open(error.error.message, 'Dismiss', {duration: 3000})
      }
    });
    
  }
}

function itemsConverter(items: any) {

  const orderedItems: any[] = Object.keys(items)
  .filter((key) => items[key].quantity > 0) 
  .map((key, index) => ({
    orderedItemId: index + 1,
    dish: { dishId: items[key].dishId },
    price: items[key].price,
    quantity: items[key].quantity
  }));

  return orderedItems;
}

