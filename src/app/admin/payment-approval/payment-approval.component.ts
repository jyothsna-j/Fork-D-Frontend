import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/services/order.service';
import { UEngageServiceService } from 'src/app/services/u-engage-service.service';

@Component({
  selector: 'app-payment-approval',
  templateUrl: './payment-approval.component.html',
  styleUrls: ['./payment-approval.component.css']
})
export class PaymentApprovalComponent {

  private _snackBar = inject(MatSnackBar);

  ordersForApproval : any[] = [];

  displayedColumns = ['orderId', 'username', 'restaurantName', 'orderDate', 'orderTime', 'amount', 'approveButton'];

  constructor(private orderService: OrderService, private uEngageService : UEngageServiceService) {}

  ngOnInit(){
    this.orderService.getOrdersForApproval().subscribe({
      next: (response) =>{
        if(response.body===null){
          this._snackBar.open('Orders not found', 'Dismiss', {duration: 3000})
        }
        else{
          this.ordersForApproval = response.body.data;
        }
      },
      error: (error: any) => {
        this._snackBar.open(error.error.message, 'Dismiss', {duration: 3000})
      }
    })
  }

  approve(orderId: any){
    const order = this.ordersForApproval.find(o => o.orderId === orderId);
    order.pickupAddress.contactNumber = String(order.pickupAddress.contactNumber)
    this.uEngageService.createTask(order).subscribe({
      next: (response) => {
        console.log(response);
        this.ordersForApproval = this.ordersForApproval.filter(order => order.orderId !== orderId);
        this._snackBar.open('Processed Successfully', 'Dismiss', {duration: 3000});
      },
      error: (error) =>{

      }
    })
  }

  cancel(orderId: any){
    this.orderService.updateOrderStatus(orderId, 'INVALID_PAYMENT').subscribe({
      next: (response) => {
        if(response.body===null){
          this._snackBar.open('Error updating status', 'Dismiss', {duration: 3000})
        }
        else{
          this.ordersForApproval = this.ordersForApproval.filter(order => order.orderId !== orderId); // This removes it from the array
        }
      },
      error: (error: any) => {
        this._snackBar.open(error.error.message, 'Dismiss', {duration: 3000})
      }
    });
    
  }
  
}