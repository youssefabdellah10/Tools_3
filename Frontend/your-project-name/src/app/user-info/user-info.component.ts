import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {
  userInfoForm: FormGroup;
  
  @Output() registrationComplete = new EventEmitter<{ email: string; password: string; role: string }>(); // Updated EventEmitter to include role
  constructor(private formBuilder: FormBuilder) {
    this.userInfoForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{10}$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$')
      ]],
      role: ['', Validators.required] // Add role field with validation
    });
  }


  get passwordErrors() {
    const passwordControl = this.userInfoForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required.';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters long.';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.';
    }
    return null;
  }

  onSubmit() {
    if (this.userInfoForm.valid) {
      const userData = this.userInfoForm.value;
      const registrationData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role
      };
  
      // Send data to the backend using fetch
      fetch('http://localhost:5000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then(errData => {
              throw new Error(errData.message || 'Failed to register user');
            });
          }
        })
        .then(data => {
          console.log('Success:', data);
          alert('Registration successful!');
          
          // Emit the user data on successful registration
          this.registrationComplete.emit({ email: userData.email, password: userData.password, role: userData.role }); // Emit role
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Registration failed! ' + error.message);
        });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}  