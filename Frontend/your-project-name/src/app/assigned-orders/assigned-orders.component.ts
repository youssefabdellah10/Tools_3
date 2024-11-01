import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assigned-orders',
  templateUrl: './assigned-orders.component.html',
  styleUrls: ['./assigned-orders.component.css']
})
export class AssignedOrdersComponent implements OnInit {
  assignedOrders: any[] = []; // Replace with appropriate type

  constructor() { }

  ngOnInit(): void {
    // Fetch assigned orders from the backend (implement the actual service call)
    this.fetchAssignedOrders();
  }

  fetchAssignedOrders() {
    // Call your service to get assigned orders and assign them to this.assignedOrders
  }

  acceptOrder(orderId: string) {
    // Logic to accept the order
  }

  declineOrder(orderId: string) {
    // Logic to decline the order
  }
}
