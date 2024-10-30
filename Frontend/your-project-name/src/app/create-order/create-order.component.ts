import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule here
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  createOrderForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.createOrderForm = this.formBuilder.group({
      productName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      deliveryTime: [''],
      location: ['', Validators.required]
    });
  }
  loading = false; 

  onCreateOrder() {
    if (this.createOrderForm.valid) {
      this.loading = true; 
      const orderData = this.createOrderForm.value;

      fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to create order');
          }
          return response.json();
        })
        .then(data => {
          console.log('Order created successfully:', data);
          alert('Order created successfully!');
          this.createOrderForm.reset(); 
        })
        .catch(error => {
          console.error('Error creating order:', error);
          alert('Failed to create order. Please try again.');
        })
        .finally(() => {
          this.loading = false; 
        });
    } else {
      alert('Please fill in all fields correctly.');
    }
  }
}
