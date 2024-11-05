import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { HttpClientModule } from '@angular/common/http'; 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

interface Order {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  package_details: string;
  status: string;
  assignedCourier?: string; 
}

@Component({
  selector: 'app-manage-orders',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule], 
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  orderForm: FormGroup; 

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.orderForm = this.formBuilder.group({
      status: [''] 
    });
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  async fetchOrders() {
    try {
      const response = await fetch('http://localhost:5000/admin/AllOrders');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.orders = await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  async updateOrderStatus(order: Order): Promise<void> {
    const newStatus = order.status; 
    if (newStatus) {
      try {
        const response = await fetch('http://localhost:5000/admin/update-order-status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: order.id, status: newStatus }),
        });
        if (!response.ok) {
          throw new Error('Failed to update order status');
        }
        await this.fetchOrders();
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  }
  
  async deleteOrder(orderId: number): Promise<void> {
  if (confirm('Are you sure you want to delete this order?')) {
    try {
      const response = await fetch(`http://localhost:5000/admin/delete/order?order_id=${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      await this.fetchOrders(); 
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  }
}

}
