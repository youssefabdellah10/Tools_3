import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orderId: string = '';
  order: any; // Store order details
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchOrderDetails(this.orderId);
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
