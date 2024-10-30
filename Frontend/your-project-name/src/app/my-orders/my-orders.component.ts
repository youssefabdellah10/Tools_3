import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 

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

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    fetch('http://localhost:5000/orders') 
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        return response.json();
      })
      .then(data => {
        this.orders = data; 
        this.loading = false; 
      })
      .catch(error => {
        console.error('Error:', error); 
        this.loading = false; 
      });
  }
}
