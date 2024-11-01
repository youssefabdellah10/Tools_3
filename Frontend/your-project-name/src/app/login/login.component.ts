import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  @Output() loginSuccess = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Send the login data to the backend using fetch
      fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then(response => {
          if (response.ok) {
            return response.json(); 
          } else {
            return response.json().then(errData => {
              throw new Error(errData.message || 'Invalid email or password');
            });
          }
        })
        .then(data => {
          console.log('Login successful:', data);
          this.loginSuccess.emit();

          // Check the role and navigate accordingly
          if (data.role === 'user') {
            alert('Login successful.');
            this.router.navigate(['/create-order']); // Navigate to CreateOrderComponent
          } else if (data.role === 'courier') {
            alert('Welcome, Courier.');
            this.router.navigate(['/assigned-orders']); // Navigate to AssignedOrdersComponent
          } else {
            alert('You do not have permission to access this page.'); // Alert for unauthorized access
          }
        })
        .catch(error => {
          console.error('Error:', error);
          // Display error message based on specific conditions
          if (error.message === 'Email not registered') {
            alert('Email not registered. Please register first.');
          } else {
            alert('Login failed: ' + error.message);
          }
        });
    } else {
      alert('Please enter a valid email and password.');
    }
  }
}
