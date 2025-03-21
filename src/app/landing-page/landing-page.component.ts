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
    this.restaurantService.getRestaurants()
      .subscribe((response:any)=>{
        response.forEach((restaurant: any) => {
          let imageBlob = new Blob([restaurant.logo.data]);

          console.log(restaurant);
          let formattedRestaurant = {
            restaurantId: restaurant.restaurantId,
            restaurantName: restaurant.restaurantName,
            cuisine: restaurant.cuisine,
            logo: restaurant.logo.data

          };
          console.log(formattedRestaurant)
          if (restaurant.logo.data!= null){
            this.restaurantService.fetchImage(restaurant.restaurantId).subscribe((blob:any)=> {
              console.log("ere" + blob)
              formattedRestaurant.logo = URL.createObjectURL(blob);
        
            });
          }
          console.log(formattedRestaurant)
          this.restaurants.push(formattedRestaurant);
        });
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
