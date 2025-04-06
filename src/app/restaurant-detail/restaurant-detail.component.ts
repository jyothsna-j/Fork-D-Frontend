import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import _ from "lodash";

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantDetailComponent {
  restaurantId!: number;
  restaurantDetails: any;
  dishes: any;
  categorizedDishes: { [key: string]: any[] }  = {};
  categories: any = [];
  cart: any = [];
  cartQuantity = 0;
  readonly panelOpenState = signal(false);

  constructor(private router: Router, private route: ActivatedRoute, private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id')); // Get ID from URL
    console.log('Restaurant ID:', this.restaurantId);
    this.getDishes(this.restaurantId);
    this.getRestaurantDetails(this.restaurantId);
  }

  getRestaurantDetails(id:number) {
    this.restaurantService.getRestaurantById(id)
      .subscribe((response:any)=>{
        this.restaurantDetails = response;
        console.log(this.restaurantDetails)
    });
  }

  getDishes(id:number) {
    this.restaurantService.getDishes(id).subscribe({
      next:(response) => {
        if(response.status===204){
          alert('no dishes found');
        }
        else{
          this.dishes = response.body?.data;
          this.categorizedDishes = _.groupBy(this.dishes, "category");
          this.categories = _.keys(this.categorizedDishes);

          this.cart = _.mapValues(_.keyBy(this.dishes, "dishName"), dish => ({
            dishId: dish.dishId,
            quantity: 0,
            price: dish.price
          }));
        }
      },
      error:(error) => {
        console.log(error);
        //TODO: add popup for handling
      }
    });
  }

  decrementCartItem(dishName: any){
    if(this.cart[dishName].quantity>0){
      this.cart[dishName].quantity -= 1;
      this.handleChange();
    }
  }

  incrementCartItem(dishName: any){
    this.cart[dishName].quantity += 1;
    this.handleChange();
  }

  handleChange(){
    this.cartQuantity =  _.sumBy(Object.values(this.cart), 'quantity');
  }

  goToCart(){
    this.router.navigate(['/cart'], {state: [this.restaurantId, this.cart]});
  }
}
