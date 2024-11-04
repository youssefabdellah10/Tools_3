import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Order {
  id: number;
  status: string;
  details: string;
}

@Component({
  selector: 'app-assigned-orders',
  templateUrl: './assigned-orders.component.html',
  styleUrls: ['./assigned-orders.component.css']
})
export class AssignedOrdersComponent implements OnInit {
  orders: Order[] = [];
  courierId: number = 1; // Replace with actual courier ID or get it from authentication if available

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAssignedOrders();
  }

  getAssignedOrders(): void {
    this.http.get<Order[]>(`/CourieOrder?courier_id=${this.courierId}`)
      .pipe(catchError(error => of([]))) // Handle errors here
      .subscribe((data) => {
        this.orders = data;
      });
  }

  acceptOrder(orderId: number): void {
    this.http.put('/acceptOrder', { order_id: orderId })
      .subscribe(() => {
        this.orders = this.orders.map(order =>
          order.id === orderId ? { ...order, status: 'picked up' } : order
        );
      });
  }

  declineOrder(orderId: number): void {
    this.http.put('/DeclineOrder', { order_id: orderId })
      .subscribe(() => {
        this.orders = this.orders.filter(order => order.id !== orderId);
      });
  }
}
