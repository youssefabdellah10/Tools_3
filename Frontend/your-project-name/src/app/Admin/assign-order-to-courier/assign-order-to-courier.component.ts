import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AssignOrderToCourier {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  package_details: string;
  status: string;
  assignedCourier: number; 
}

@Component({
  selector: 'app-assign-order-to-courier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-order-to-courier.component.html',
  styleUrls: ['./assign-order-to-courier.component.css']
})
export class AssignOrderToCourierComponent implements OnInit {
  orders: AssignOrderToCourier[] = [];
  couriers: { id: number; name: string }[] = [];
  selectedCourierId: number | null = null;
  errorMessage: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    await Promise.all([this.fetchAssignedOrders(), this.fetchCouriers()]);
  }

  private async fetchAssignedOrders() {
    try {
      const response = await fetch('http://localhost:5000/admin/assigned-orders');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      this.orders = data.filter((order: AssignOrderToCourier) => order.status !== 'delivered');
    } catch (error) {
      this.handleError('Error fetching assigned orders:', error);
    }
  }

  getCourierName(courierId: number): string {
    const courier = this.couriers.find(courier => courier.id === courierId);
    return courier ? courier.name : 'Unassigned';
  }

  private async fetchCouriers() {
    try {
      const response = await fetch('http://localhost:5000/couriers');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.couriers = await response.json();
    } catch (error) {
      this.handleError('Error fetching couriers:', error);
    }
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    this.errorMessage = message;
  }

  onReassignOrder(orderId: number) {
    if (this.selectedCourierId !== null) {
      this.reassignOrder(orderId, this.selectedCourierId);
    } else {
      this.errorMessage = 'Please select a courier';
    }
  }

  async reassignOrder(orderId: number, newCourierId: number) {
    try {
      const response = await fetch('http://localhost:5000/AssignOrder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, courierId: newCourierId }),
      });

      if (!response.ok) throw new Error('Failed to reassign order');

      await this.fetchAssignedOrders();
      this.selectedCourierId = null;
    } catch (error) {
      this.handleError('Error reassigning order:', error);
    }
  }
}
