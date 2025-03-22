import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Order {
  id: number;
  customer: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: string;
}

@Component({
  selector: 'app-live-orders',
  templateUrl: './live-orders.component.html',
  styleUrls: ['./live-orders.component.css'],
})
export class LiveOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedStatus: string = '';
  selectedOrder: Order | null = null;
  isPanelOpen = false;

  orderStatuses = ['Pending', 'Preparing', 'Ready for delivery', 'Picked up for delivery','Reaching your destination', 'Completed'];
  displayedColumns: string[] = ['id', 'customer', 'total', 'status', 'update'];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchOrders();
    setInterval(() => this.fetchOrders(), 5000); // Polling every 5 sec
  }

  fetchOrders(): void {
    this.http.get<Order[]>('http://localhost:3000/orders/live').subscribe((data) => {
      this.orders = data;
    });
  }

  filteredOrders(): Order[] {
    return this.selectedStatus
      ? this.orders.filter((order) => order.status === this.selectedStatus)
      : this.orders;
  }

  updateStatus(order: Order): void {
    this.http.put(`http://localhost:8080/orders/${order.id}/status`, { status: order.status }).subscribe(() => {
      this.snackBar.open('Order status updated', 'OK', { duration: 2000 });
    });
  }

  getStatusColor(status: string): string {
    return {
      'Pending': 'warn',
      'Preparing': 'primary',
      'Ready': 'accent',
      'Completed': 'default',
    }[status] || 'default';
  }

  openPanel(order: Order): void {
    this.selectedOrder = order;
    this.isPanelOpen = true;
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.selectedOrder = null;
  }
}
