import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; 
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-my-orders',
  standalone: true,  
  imports: [CommonModule, RouterModule],  
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId);  
    if (!userId) {
      this.errorMessage = 'User not logged in';
      this.loading = false;
      return;
    }
  
    fetch(`http://localhost:5000/users/order?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    })
    .then(data => {
      console.log('Orders:', data);  
      this.orders = data;
      if (data.length === 0) {
        this.errorMessage = 'No orders found';
      }
      this.loading = false;
    })
    .catch(error => {
      console.error('Error:', error);
      this.errorMessage = 'Failed to load orders. Please try again later.';
      this.loading = false;
    });
  }

  navigateToOrderDetails(orderId: string) {
    this.router.navigate(['/order-details', orderId]);
  }
}
