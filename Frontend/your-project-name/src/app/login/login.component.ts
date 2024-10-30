import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  @Output() loginSuccess = new EventEmitter<void>(); // Emit event on successful login

  constructor(private formBuilder: FormBuilder) {
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
          alert('Login successful!');
          this.loginSuccess.emit(); // Emit the login success event
        })
        .catch(error => {
          console.error('Error:', error);
          if (error.message === 'Email not registered') {
            alert('Email not registered. Please register first.');
          } else {
            alert('Login failed: Invalid email or password');
          }
        });
    } else {
      alert('Please enter a valid email and password.');
    }
  }
}
