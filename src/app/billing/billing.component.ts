import { Component, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import _ from "lodash";
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {
  userName = 'Jyothsna';
  isLoggedIn: boolean = false
  address: FormGroup;
  totalPrice: number = 0;
  Razorpay: any;

  constructor( private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.address = this.fb.group({
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    let restaurantId = history.state[0];
    let tempData = history.state[1];
    let prices = _.mapValues(tempData, (cartItem) => cartItem.price*cartItem.quantity);
    console.log(prices);
    this.totalPrice = _.reduce(_.values(prices),(sum, price) => sum + (Number(price) || 0), 0);
    console.log(this.totalPrice);

    this.isLoggedIn = this.userService.isLoggedIn();
    console.log(this.isLoggedIn);
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
          this.router.navigate(['/signup']);
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
