import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import _ from "lodash";
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent} from '@angular/material/chips';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddDishDialogComponent } from 'src/app/_modals/add-dish-dialog/add-dish-dialog.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-restaurant-data',
  templateUrl: './edit-restaurant-data.component.html',
  styleUrls: ['./edit-restaurant-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRestaurantDataComponent {
  restaurantUserId: string | null = '';
  restaurantId: number = 0;
  restaurantDetails: any = {};
  restaurantCuisines: string[] = [];

  private categoriesSubject = new BehaviorSubject<{ [key: string]: any[] }>({});
  categories$: Observable<{ [key: string]: any[] }> = this.categoriesSubject.asObservable();

  constructor(private router: Router, private route: ActivatedRoute, private restaurantService: RestaurantService, private dialog: MatDialog, private authService: UserService) {
  }

  ngOnInit() {
    this.restaurantUserId = this.authService.getUserId();
    this.getRestaurantDetails(this.restaurantUserId);
  }
    
  getRestaurantDetails(id:any) {
    this.restaurantService.getRestaurantByUserId(id).subscribe({
      next: (response) => {
        if(response.status===204 || response.body===null){
          //TODO: implement a snack bar
        }
        else{
          this.restaurantDetails = response.body.data
          this.restaurantId = this.restaurantDetails.restaurantId;
          this.restaurantCuisines  = this.restaurantDetails.cuisine.split(",") || []
          this.cuisines.set([...this.restaurantCuisines]);
          this.getDishes(this.restaurantId);
          console.log(this.restaurantDetails);
        }
      },
      error: (error) => {
        //TODO: implemet a snack bar
      }
    });
  }

  getDishes(id:number) {
    console.log(id);
    let dishes: any, categorizedDishes: { [key: string]: any[] }  = {};
    this.restaurantService.getDishes(id).subscribe({
      next:(response) => {
        dishes = response.body?.data.map((dish: any) => {
          if (dish.dishImage && dish.dishImage.data && dish.dishImage.imageType) {
            dish.display = `data:${dish.dishImage.imageType};base64,${dish.dishImage.data}`;
          } else {
            dish.display = null;
          }
          return dish;
        });
        categorizedDishes = _.groupBy(dishes, "category");
        console.log(categorizedDishes);
        this.categoriesSubject.next(categorizedDishes);
      },
      error:(error) => {
        console.log(error);
        //TODO: add popup for handling
      }
    });
  }

  //MAT CHIP CODE -
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  cuisines = signal<string[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.cuisines.update(cuisines => [...cuisines,  value]);
    }

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

    if (!value) {
      this.remove(cuisine);
      return;
    }

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

  uploadCuisine(){
    const payload = {
      restaurantId: this.restaurantId,
      cuisine: this.cuisines().join(', ')
    };

    this.restaurantService.updateRestaurantCuisine(this.restaurantId, payload).subscribe({
      next: (response) => {
        if(response.body){
          console.log(response.body);
          //TODO: snack bar here
        }
      },
      error: (error) => {
        //TODO - snack bar
        console.log(error);
      }
    });
  }
  
  selectedFile!: File;
  imageURL!: any;
  
  onFileSelected(event: any){
    console.log(event);
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      //TODO: change alerts into snackbar
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('logo', this.selectedFile);

    this.restaurantService.updateRestaurantImage(this.restaurantId, formData).subscribe({
      next: (response) => {
        if(response.body){
          console.log(response.body);
          //TODO: snack bar here
        }
      },
      error: (error) => {
        //TODO - snack bar
        console.log(error);
      }
    });
  }

  //CATEGORIES
  addCategory(categoryKey: string) {
    if(categoryKey==''){
      alert('cant be empty');
      return;
    }
    const currentCategories = this.categoriesSubject.getValue();

    // If the key already exists, don't add again
    if (currentCategories[categoryKey]) return;

    const updatedCategories = {
      ...currentCategories,
      [categoryKey]: []
    };

    this.categoriesSubject.next(updatedCategories);
  }

  addDish(category: string) {
    const dialogRef = this.dialog.open(AddDishDialogComponent, {
      width: '400px',
      data: { category },
    });
  
    dialogRef.afterClosed().subscribe((newDish) => {
      if (newDish) {
        let dish:any =  {
          "restaurant_id": this.restaurantId,
          "dishName": newDish.dishName,
          "category": newDish.category,
          "price": newDish.price
        }
        const formData = new FormData();
        const dishBlob = new Blob([JSON.stringify(dish)], { type: 'application/json' });
        formData.append('dish', dishBlob);  // matches @RequestPart Dish dish
        formData.append('pic', newDish.display);

        this.restaurantService.addDish(this.restaurantId, formData).subscribe({
          next:(response) => {
            if(response.body){
              const current = this.categoriesSubject.getValue();
              const updated = {
                ...current,
                [category]: [...(current[category] || []), newDish],
              };
              this.categoriesSubject.next(updated);
            }
          },
          error:(error) => {
            console.log(error);
            //TODO: add popup for handling
          }
        });
      }
    });
  }

  editingDishId: number | null = null;
  replaceImage: boolean = false;
  fileByteDish: File | null = null;

  editDish(dishId: number) {
    this.editingDishId = dishId;
    this.replaceImage = false
  }
  
  cancelEdit() {
    this.editingDishId = null;
    this.replaceImage = false;
    this.fileByteDish  = null;
  }

  removePreview() {
    this.replaceImage = true;
    this.fileByteDish  = null;
  }
  
  onFileSelectedd(event: any, dish: any) {
    this.fileByteDish = event.target.files[0];
    dish.display = URL.createObjectURL(event.target.files[0]);
    this.replaceImage = false;
  }
  
  saveDish(dish: any) {
    console.log('Saving', dish);
    this.editingDishId = null;
    const formData = new FormData();
    const dishBlob = new Blob([JSON.stringify(dish)], { type: 'application/json' });
    formData.append('dish', dishBlob);  // matches @RequestPart Dish dish
    if (this.fileByteDish) {
      formData.append('pic', this.fileByteDish);  // Matches @RequestParam("pic")
    }
    else{
      formData.append('pic', new Blob());
    }
    this.restaurantService.updateDish(this.restaurantId, formData).subscribe({
      next:(response) => {
        if(response.body){
          this.fileByteDish  = null;
        }
      },
      error:(error) => {
        console.log(error);
        //TODO: add popup for handling
      }
    });
    
  }

  deleteDish(category: string, dishId: number) {

    this.restaurantService.deleteDish(this.restaurantId, dishId).subscribe({
      next:(response) => {
        if(response){
          const currentCategories = this.categoriesSubject.getValue();
          const updatedCategory = currentCategories[category]?.filter(dish => dish.dishId !== dishId);

          const updatedCategories = {
            ...currentCategories,
            [category]: updatedCategory
          };
          
          this.categoriesSubject.next(updatedCategories);
        }
      },
      error:(error) => {
        console.log(error);
        //TODO: add popup for handling
      }
    });
  }
}
