import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="errorMessage">{{ errorMessage }}</div>
    <div *ngIf="!loading && !errorMessage">
      <h2>Order Details for Order ID: {{ orderId }}</h2>
      <pre>{{ order | json }}</pre>
      <button (click)="cancelOrder()">Cancel Order</button>
    </div>
  `
})
export class OrderDetailsComponent implements OnInit {
  orderId: string = '';
  order: any; 
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.fetchOrderDetails(this.orderId);
    } else {
      this.errorMessage = 'Order ID not found in the URL';
      this.loading = false;
    }
  }
  
  fetchOrderDetails(orderId: string) {
    fetch(`http://localhost:5000/orders/${orderId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        return response.json();
      })
      .then(data => {
        this.order = data; 
        this.loading = false;
      })
      .catch(error => {
        console.error('Error:', error);
        this.errorMessage = 'Error fetching order details: ' + error.message;
        this.loading = false; 
      });
  }

  cancelOrder() {
    fetch(`http://localhost:5000/orders/${this.orderId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        this.router.navigate(['/my-orders']);
      } else {
        throw new Error('Failed to cancel order');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.errorMessage = 'Error cancelling order: ' + error.message;
    });
  }
}
