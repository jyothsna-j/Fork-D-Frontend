import { Component, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import _ from "lodash";
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {
  userName: any;
  restaurantId: any;
  isLoggedIn: boolean = false
  address: FormGroup;
  totalPrice: number = 0;
  Razorpay: any;
  itemValues: any;

  constructor( private userService: UserService, private fb: FormBuilder, private router: Router, private orderService: OrderService) {
    this.address = this.fb.group({
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.restaurantId = history.state[0];
    this.itemValues = history.state[1];
    let prices = _.mapValues(this.itemValues, (cartItem) => cartItem.price*cartItem.quantity);
    console.log(this.itemValues);
    this.totalPrice = _.reduce(_.values(prices),(sum, price) => sum + (Number(price) || 0), 0);
    console.log(this.totalPrice);

    this.isLoggedIn = this.userService.isLoggedIn();
    this.userName = this.userService.getUsername();
  } 

  makePayment(){
    var options = {
      key: "rzp_test_jYkGT70nFmsWUm",
      key_secret: "",
      amount: this.totalPrice *100,
      currency: "INR",
      name: "Jyoths",
      description: "payment for testing",
      handler: (response: any) => {
        console.log(response);
        if(response.razorpay_payment_id){
            var order = {
              user: {
                userId: this.userService.getUserId()
              },
              restaurant: {
                restaurantId: this.restaurantId
              },
              amount: this.totalPrice,
              orderStatus: "PENDING",
              orderDate: Date.now(),
              items: itemsConverter(this.itemValues)
            }
          
            console.log(order);
          this.orderService.postOrder(order);
          this.router.navigate(['/orders']);
        }
      },
      prefill: {
        name: "Jyothsna",
        email: "mjr.jyothsna@gmail.com",
        contact: "8248554906"
      },
      notes:{
        address: "Razorpay Corporate Office"
      },
      theme: {
        color: "#aaaaa"
      }
    };
    var pay = new (window as any).Razorpay(options);
    pay.open();
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

