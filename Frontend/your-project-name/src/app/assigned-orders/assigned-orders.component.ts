import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

interface Order {
  id: number;
  status: string;
  pickup_location?: string;
  dropoff_location?: string;
  package_details?: string;  
}
@Component({
  selector: 'app-assigned-orders',
  templateUrl: './assigned-orders.component.html',
  styleUrls: ['./assigned-orders.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class AssignedOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrderDetails: Order | null = null; 
  courierId: number = 1;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAssignedOrders();
  }

  getAssignedOrders(): void {
    this.http.get<Order[]>(`http://localhost:5000/CourierOrder?courier_id=${this.courierId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching assigned orders:', error);
          return of([]); 
        })
      )
      .subscribe((data) => {
        console.log('Fetched orders:', data);
        this.orders = Array.isArray(data) ? data : [];
      });
  }

  acceptOrder(orderId: number): void {
    this.http.put('http://localhost:5000/acceptOrder', { order_id: orderId })
      .subscribe(() => {
        this.orders = this.orders.map(order =>
          order.id === orderId ? { ...order, status: 'picked up' } : order
        );
      }, error => {
        console.error('Error accepting order:', error);
      });
  }

  declineOrder(orderId: number): void {
    this.http.put('http://localhost:5000/DeclineOrder', { order_id: orderId })
      .subscribe(() => {
        this.orders = this.orders.filter(order => order.id !== orderId);
      }, error => {
        console.error('Error declining order:', error);
      });
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.http.put('http://localhost:5000/UpdateOrderStatus', { orderId, status })
      .subscribe(() => {
        this.orders = this.orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        );
      }, error => {
        console.error('Error updating order status:', error);
      });
  }
  
  canUpdateStatus(order: Order): boolean {

    return order.status === 'picked up';
  }
  
}
