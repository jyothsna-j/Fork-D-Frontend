import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import _ from "lodash";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantDetailComponent {

  private _snackBar = inject(MatSnackBar);

  restaurantId!: number;
  restaurantDetails: any;
  dishes: any;
  categorizedDishes: { [key: string]: any[] }  = {};
  categories: any = [];
  cart: any = [];
  cartQuantity = 0;
  readonly panelOpenState = signal(false);
  loading = true;

  constructor(private router: Router, private route: ActivatedRoute, private restaurantService: RestaurantService, 
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id')); // Get ID from URL
    console.log('Restaurant ID:', this.restaurantId);
    this.getDishes(this.restaurantId);
    this.getRestaurantDetails(this.restaurantId);
  }

  getRestaurantDetails(id:number) {
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (response) =>{
        if(response.status === 204 || response.body === null){
          this._snackBar.open('Restaurants not found', 'Dismiss', {duration: 3000})
          return;
        }
        else{
         this.restaurantDetails = response.body.data;
        }
      }
    });
  }

  getDishes(id:number) {
    this.restaurantService.getDishes(id).subscribe({
      next:(response) => {
        if(response.status===204){
          this._snackBar.open('Dishes not found', 'Dismiss', {duration: 3000})
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
          this.loading = false;
          this.cdr.markForCheck(); 
        }
      },
      error:(error) => {
        console.log(error);
        this._snackBar.open(error.error.message, 'Dismiss', {duration: 3000})
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

  goToBilling(){
    this.router.navigate(['/billing'], {state: [this.restaurantId, this.cart]});
  }
}
