import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  assignedCourier: number | null;
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
  couriers: { id: number, name: string }[] = [];

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.orderForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.fetchOrders();
    this.fetchCouriers();
  }

  async fetchCouriers() {
    try {
      const response = await fetch('http://localhost:5000/couriers');
      if (!response.ok) {
        throw new Error('Failed to fetch couriers');
      }
      this.couriers = await response.json();
    } catch (error) {
      console.error('Error fetching couriers:', error);
    }
  }

  async fetchOrders() {
    try {
      const response = await fetch('http://localhost:5000/admin/AllOrders');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.orders = await response.json();

      this.orders.forEach(order => {
        this.orderForm.addControl(`status-${order.id}`, new FormControl(order.status));
        this.orderForm.addControl(`assignedCourier-${order.id}`, new FormControl(order.assignedCourier));
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  async updateOrderStatus(order: Order): Promise<void> {
    const newStatus = this.orderForm.get(`status-${order.id}`)?.value;
    if (newStatus) {
      try {
        const response = await fetch('http://localhost:5000/UpdateOrderStatus', {
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

  async assignCourier(order: Order): Promise<void> {
    const courierId = this.orderForm.get(`assignedCourier-${order.id}`)?.value;
    if (courierId) {
      try {
        const response = await fetch('http://localhost:5000/AssignOrder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: order.id, courierId }),
        });
        if (!response.ok) {
          throw new Error('Failed to assign courier');
        }
        await this.fetchOrders();

        alert('Courier assigned successfully!');
      } catch (error) {
        console.error('Error assigning courier:', error);
      }
    } else {
      alert('Please enter a courier ID');
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
