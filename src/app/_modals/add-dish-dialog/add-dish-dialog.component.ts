import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dish-dialog',
  templateUrl: './add-dish-dialog.component.html',
  styleUrls: ['./add-dish-dialog.component.css']
})
export class AddDishDialogComponent {
  dishForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDishDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: string }
  ) {
    this.dishForm = this.fb.group({
      dishName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
    });
  }

  selectedFile!: File;
  imageURL!: any;
  
  onFileSelected(event: any){
    console.log(event);
    this.selectedFile = event.target.files[0];
  }

  submit() {
    if (this.dishForm.valid) {
      const newDish = {
        ...this.dishForm.value,
        category: this.data.category,
        display: this.selectedFile
      };
      this.dialogRef.close(newDish);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}