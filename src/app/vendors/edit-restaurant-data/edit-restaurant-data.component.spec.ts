import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestaurantDataComponent } from './edit-restaurant-data.component';

describe('EditRestaurantDataComponent', () => {
  let component: EditRestaurantDataComponent;
  let fixture: ComponentFixture<EditRestaurantDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRestaurantDataComponent]
    });
    fixture = TestBed.createComponent(EditRestaurantDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
