import { Component, ViewChild,  ElementRef } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  restaurants: any= [];

  constructor(private restaurantService: RestaurantService, private router: Router, private sanitizer: DomSanitizer){} 

  ngOnInit(){
    this.getRestaurants();
  }

  getRestaurants(){
    this.restaurantService.getRestaurants().subscribe({
      next: (response) => {
        if(response.body===null){
          //TODO: make a snackbar
        }
        else{
          response.body.data.forEach((restaurant: any) => {
            let formattedRestaurant = {
              restaurantId: restaurant.restaurantId,
              restaurantName: restaurant.restaurantName,
              cuisine: restaurant.cuisine,
              logo: ''
            };
            if (restaurant.logo.data!= null){
              this.restaurantService.fetchRestaurantImage(restaurant.restaurantId).subscribe((blob:any)=> {
                formattedRestaurant.logo = URL.createObjectURL(blob);
              });
            }
            this.restaurants.push(formattedRestaurant);
          });
        }
      },
      error: (error: any) => {
        //TODO
      }
    });
  }

  openRestaurant(id : number) {
    this.router.navigate(['/restaurant', id]);
  }

  scrollLeft() {
    const scrollAmount = this.scrollContainer.nativeElement.clientWidth * 0.25;  // Scroll by 25% of the container width
    this.scrollContainer.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollRight() {
    const scrollAmount = this.scrollContainer.nativeElement.clientWidth * 0.25;
    this.scrollContainer.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  

}
