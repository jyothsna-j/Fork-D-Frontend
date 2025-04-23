import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { UEngageServiceService } from 'src/app/services/u-engage-service.service';

@Component({
  selector: 'app-payment-approval',
  templateUrl: './payment-approval.component.html',
  styleUrls: ['./payment-approval.component.css']
})
export class PaymentApprovalComponent {

  ordersForApproval : any[] = [];

  displayedColumns = ['orderId', 'username', 'restaurantName', 'orderDate', 'orderTime', 'amount', 'approveButton'];

  constructor(private orderService: OrderService, private uEngageService : UEngageServiceService) {}

  ngOnInit(){
    this.orderService.getOrdersForApproval().subscribe({
      next: (response) =>{
        if(response.body===null){
          //TODO: make a snackbar
        }
        else{
          this.ordersForApproval = response.body.data;
        }
      },
      error: (error: any) => {
        //TODO
      }
    })
  }

  approve(orderId: any){
    const order = this.ordersForApproval.find(o => o.orderId === orderId);
    this.uEngageService.createTask(order).subscribe({
      next: (response) => {
        alert(response);
        console.log(response);
        this.ordersForApproval = this.ordersForApproval.filter(order => order.orderId !== orderId);
      },
      error: (error) =>{

      }
    })
  }

  cancel(orderId: any){
    this.orderService.updateOrderStatus(orderId, 'INVALID_PAYMENT').subscribe({
      next: (response) => {
        if(response.body===null){
          //TODO: make a snackbar
        }
        else{
          this.ordersForApproval = this.ordersForApproval.filter(order => order.orderId !== orderId); // This removes it from the array
        }
      },
      error: (error: any) => {
        //TODO
      }
    });
    
  }
  
}