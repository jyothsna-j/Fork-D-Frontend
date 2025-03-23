import { Component } from '@angular/core';
import { Router } from '@angular/router';
import _ from "lodash";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  restaurantId: any;
  cartData: { [key: string]: any } = {};
  isCartEmpty: boolean = true;
  prices: { [key: string]: number } = {};
  totalPrice: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    let tempData = history.state;
    this.restaurantId = tempData[0];
    this.cartData = _.pickBy(tempData[1], item => item.quantity > 0);
    console.log("Received Data:", this.cartData);
    this.isCartEmpty= Object.keys(this.cartData).length === 0;
    this.handleChange()
  }

  decrementCartItem(dishName: any){
    if(this.cartData[dishName].quantity>0){
      this.cartData[dishName].quantity -= 1;
      this.handleChange();
      if(this.cartData[dishName].quantity===0){
        this.cartData = _.pickBy(this.cartData, item => item.quantity > 0);
      }
      this.isCartEmpty= Object.keys(this.cartData).length === 0;
    }
  }

  incrementCartItem(dishName: any){
    this.cartData[dishName].quantity += 1;
    this.handleChange()
  }

  handleChange(){
    this.prices = _.mapValues(this.cartData, (cartItem) => cartItem.price*cartItem.quantity);
    this.totalPrice = _.reduce(_.values(this.prices), (sum, price) => sum + price, 0);
  }

  goToBilling(){
    console.log(this.cartData);
    this.router.navigate(['/billing'], {state: [this.restaurantId, this.cartData]});
  }
}
