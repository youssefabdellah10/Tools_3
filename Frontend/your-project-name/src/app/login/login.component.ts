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
  @Output() loginSuccess = new EventEmitter<string>(); // Emit user role

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      fetch('http://localhost:5000/login', {
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
          
          // Emit user role
          this.loginSuccess.emit(data.role); // Emit role here
  
          // You can remove the switch statement for navigation
          alert('Login successful.');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Login failed: ' + error.message);
        });
    } else {
      alert('Please enter a valid email and password.');
    }
  }
}  