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
  selectedFile!: File;
  imageURL!: any;

  constructor(private restaurantService: RestaurantService, private router: Router, private sanitizer: DomSanitizer){} 

  ngOnInit(){
    this.getRestaurants();
  }

  getRestaurants(){
    this.restaurantService.getRestaurants()
      .subscribe((response:any)=>{
        this.restaurants = response;
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

  
  onFileSelected(event: any){
    console.log(event);
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    console.log(formData.getAll);

    this.restaurantService.postImage(formData)
  }

  viewFile() {
    this.restaurantService.fetchImage().subscribe((blob:any)=> {
      this.imageURL = URL.createObjectURL(blob);

    });
    console.log(this.imageURL);
  }

}
