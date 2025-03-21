import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import _ from "lodash";
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-edit-restaurant-data',
  templateUrl: './edit-restaurant-data.component.html',
  styleUrls: ['./edit-restaurant-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRestaurantDataComponent {
  restaurantId: number = 0;
  restaurantDetails: any = {};
  restaurantCuisines: string[] = [];

  dishes: any;
  categorizedDishes: { [key: string]: any[] }  = {};
  categories: any = [];

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
    this.restaurantService.getDishes(id)
      .subscribe((response:any)=>{
        this.dishes = response;
        console.log(this.dishes);
        this.categorizedDishes = _.groupBy(this.dishes, "category");
        this.categories = _.keys(this.categorizedDishes); 
        console.log(this.categorizedDishes)
        console.log(this.categories)
    });
  }

  //MAT CHIP CODE
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  
  example:string[]  = this.restaurantDetails?.cuisine?.split(",") || []
  readonly cuisines = signal<string[]>(this.example);
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    console.log(this.restaurantDetails.cuisines);
    console.log(this.example)
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.cuisines.update(cuisines => [...cuisines,  value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(cuisine: any): void {
    this.cuisines.update(cuisines => {
      const index = cuisines.indexOf(cuisine);
      if (index < 0) {
        return cuisines;
      }

      cuisines.splice(index, 1);
      this.announcer.announce(`Removed ${cuisine}`);
      return [...cuisines];
    });
  }

  edit(cuisine: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(cuisine);
      return;
    }

    // Edit existing fruit
    this.cuisines.update(cuisines => {
      const index = cuisines.indexOf(cuisine);
      if (index >= 0) {
        cuisines[index] = value;
        return [...cuisines];
      }
      return cuisines;
    });
  }

  trackCuisines(index: number, cuisine: any): any {
    return cuisine ? cuisine : null;
  }
}
