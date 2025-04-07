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

  private categoriesSubject = new BehaviorSubject<{ [key: string]: any[] }>({});
  categories$: Observable<{ [key: string]: any[] }> = this.categoriesSubject.asObservable();

  constructor(private router: Router, private route: ActivatedRoute, private restaurantService: RestaurantService, private dialog: MatDialog) {
  }

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
        this.restaurantCuisines  = this.restaurantDetails.cuisine.split(",") || []
        this.cuisines.set([...this.restaurantCuisines]);
    });
    console.log(this.cuisines)
  }

  getDishes(id:number) {
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

    // Add our value
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


  
  selectedFile!: File;
  imageURL!: any;
  
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
    formData.append('logo', this.selectedFile);
    const restaurantData = JSON.stringify(this.restaurantDetails);
    formData.append('restaurant', new Blob([restaurantData], { type: 'application/json' }));
    console.log(formData.getAll);

    this.restaurantService.postImage(formData)
  }

  viewFile() {
    this.restaurantService.fetchImage(this.restaurantId).subscribe((blob:any)=> {
      this.imageURL = URL.createObjectURL(blob);

    });
    console.log(this.imageURL);
  }

  //CATEGORIES
  addCategory(categoryKey: string) {
    const currentCategories = this.categoriesSubject.getValue();

    // If the key already exists, don't add again
    if (currentCategories[categoryKey]) return;

    const updatedCategories = {
      ...currentCategories,
      [categoryKey]: []
    };

    this.categoriesSubject.next(updatedCategories);
  }

  editCategory(name: string) {
    // const category = this.categories.find(c => c.id === id);
    // if (category) {
    //   category.name = name;
    //   this.categorySubject.next([...this.categories]);
    // }
  }

  deleteCategory(id: string) {
    // const index = this.categories.findIndex(c => c.id === id);
    // if (index !== -1 && this.categories[index].dishes.length === 0) {
    //   this.categories.splice(index, 1);
    //   this.categorySubject.next([...this.categories]);
    // } else {
    //   alert('Cannot delete category with dishes.');
    // }
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
              console.log(response.body);
              console.log(+response.body.split(": ")[1])
            }
          },
          error:(error) => {
            console.log(error);
            //TODO: add popup for handling
          }
        });

        const current = this.categoriesSubject.getValue();
              const updated = {
                ...current,
                [category]: [...(current[category] || []), newDish],
              };
              this.categoriesSubject.next(updated);
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
          console.log(response.body);
        }
      },
      error:(error) => {
        console.log(error);
        //TODO: add popup for handling
      }
    });
    
    this.fileByteDish  = null;
  }

  deleteDish(category: string, dishId: number) {

    this.restaurantService.deleteDish(this.restaurantId, dishId).subscribe({
      next:(response) => {
        if(response){
          console.log(response.body);
        }
      },
      error:(error) => {
        console.log(error);
        //TODO: add popup for handling
      }
    });


    const currentCategories = this.categoriesSubject.getValue();
    const updatedCategory = currentCategories[category]?.filter(dish => dish.dishId !== dishId);

    const updatedCategories = {
      ...currentCategories,
      [category]: updatedCategory
    };

    console.log(category, dishId)
    console.log(currentCategories, updatedCategory, updatedCategories);
    this.categoriesSubject.next(updatedCategories);
  }
}
