import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-payment-approval',
  templateUrl: './payment-approval.component.html',
  styleUrls: ['./payment-approval.component.css']
})
export class PaymentApprovalComponent {

  ordersForApproval : any[] = [];

  displayedColumns = ['orderId', 'username', 'restaurantName', 'orderDate', 'orderTime', 'amount', 'approveButton']

  constructor(private orderService: OrderService) {}

  ngOnInit(){
    this.orderService.getOrdersForApproval().subscribe({
      next: (response) =>{
        this.ordersForApproval = response;
      }
    })
  }

  approve(orderId: any){

  }

  cancel(orderId: any){

  }
  
}