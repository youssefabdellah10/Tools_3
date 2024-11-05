import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

interface assignOrderToCourier {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  package_details: string;
  status: string;
  assignedCourier: { id: number; name: string }; 
}

@Component({
  selector: 'app-assign-order-to-courier',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-order-to-courier.component.html',
  styleUrls: ['./assign-order-to-courier.component.css']
})
export class AssignOrderToCourierComponent implements OnInit {
  orders: assignOrderToCourier[] = [];
  couriers: { id: number; name: string }[] = [];
  selectedCourierId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchAssignedOrders();
    this.fetchCouriers();
  }

  async fetchAssignedOrders() {
    try {
      const response = await fetch('http://localhost:5000/admin/assigned-orders');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.orders = await response.json();
    } catch (error) {
      console.error('Error fetching assigned orders:', error);
    }
  }

  async fetchCouriers() {
    try {
      const response = await fetch('http://localhost:5000/admin/couriers');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.couriers = await response.json();
    } catch (error) {
      console.error('Error fetching couriers:', error);
    }
  }

  async reassignOrder(orderId: number, newCourierId: number) {
    try {
      const response = await fetch(`http://localhost:5000/admin/reassign-order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, newCourierId }),
      });
      if (!response.ok) {
        throw new Error('Failed to reassign order');
      }
      await this.fetchAssignedOrders(); 
      this.selectedCourierId = null; 
    } catch (error) {
      console.error('Error reassigning order:', error);
    }
  }
}
