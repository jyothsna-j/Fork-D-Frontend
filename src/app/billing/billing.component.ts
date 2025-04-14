import { Component, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import _ from "lodash";
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { DropLocations, DropPoint } from '../_models/address';
import { UEngageServiceService } from '../services/u-engage-service.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {

  //user values
  userName: any;

  //restaurant values
  restaurantId: any;
  isLoggedIn: boolean = false
  address: FormGroup;
  totalPrice: number = 0;
  itemValues: any;

  //
  dropLocations: DropPoint[] = DropLocations;
  deliveryCharge: any = 0;
  isDeliverable : boolean | null = null;

  constructor( private userService: UserService, private fb: FormBuilder, private router: Router, private orderService: OrderService, private uEngageService: UEngageServiceService) {
    this.address = this.fb.group({
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.restaurantId = history.state[0];
    this.itemValues = _.pickBy(history.state[1], item => item.quantity > 0);

    this.isLoggedIn = this.userService.isLoggedIn();
    this.userName = this.userService.getUsername();
  } 

  setTotalPrice(data: number) {
    this.totalPrice = data;
  }

  checkDeliverability(address: any){
    const selectedPickup = this.dropLocations.find(loc => loc.key === address.value);
    if(selectedPickup){
      var payload = {
        "store_id": "89",
        "pickupDetails": {
          "latitude": "28.39232449",
		      "longitude": "77.34029003"
        },
        "dropDetails": {
          latitude: selectedPickup.lat,
          longitude: selectedPickup.lng
        }
      }
      console.log(payload);
      this.uEngageService.getServiceability(payload).subscribe({
        next:(response) => {
          if(response.body){
            //TODO - handle failure
            this.deliveryCharge = response.body.payouts.total;
            this.isDeliverable=true
          }
        },
        error:(error) => {
          console.log(error);
          //TODO: add popup for handling
        }
      })
    }
    
    
  }

  paymentMade(){
    var order = {
      user: {
        userId: this.userService.getUserId()
      },
      restaurant: {
        restaurantId: this.restaurantId
      },
      amount: this.totalPrice,
      orderStatus: "PAYMENT_APPROVAL_PENDING",
      orderDate: Date.now(),
      items: itemsConverter(this.itemValues)
    }
  
    console.log(order);
    this.orderService.postOrder(order);
    this.router.navigate(['/orders']);
  }

            

}

function itemsConverter(items: any) {

  const orderedItems: any[] = Object.keys(items).map((key, index) => ({
    orderedItemId: index + 1,
    dish: { dishId: items[key].dishId },
    price: items[key].price,
    quantity: items[key].quantity
  }));

  return orderedItems;
}

