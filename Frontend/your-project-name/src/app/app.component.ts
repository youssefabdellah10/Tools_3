import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { UserInfoComponent } from './user-info/user-info.component';
import { LoginComponent } from './login/login.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Welcome to Our Application</h1>
      
      <div *ngIf="!loggedIn">
        <div class="button-group">
          <button class="btn" (click)="loadUserInfo()">Register</button>
          <button class="btn secondary" (click)="loadLogin()">Login</button>
        </div>

        <!-- Container for dynamically loaded components -->
        <ng-container #container></ng-container>
      </div>

      <div *ngIf="loggedIn" class="button-group">
        <button class="btn" (click)="loadCreateOrder()">Create Order</button>
        <button class="btn secondary" (click)="loadMyOrders()">My Orders</button>
      </div>

      <!-- This will be the container for loaded components -->
      <ng-container #container></ng-container>
    </div>
  `,
  styles: [
    `
    .container {
      max-width: 500px;
      margin: 60px auto;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      text-align: center;
      background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    }

    h1 {
      font-size: 26px;
      margin-bottom: 30px;
      color: #444;
      font-weight: bold;
    }

    .button-group {
      display: flex;
      justify-content: space-evenly;
      margin-bottom: 25px;
    }

    .btn {
      padding: 12px 25px;
      font-size: 16px;
      color: #fff;
      background-color: #28a745;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }

    .btn.secondary {
      background-color: #007bff;
    }

    .btn:hover {
      background-color: #218838;
      transform: translateY(-3px);
    }

    .btn.secondary:hover {
      background-color: #0056b3;
    }

    .btn:focus {
      outline: none;
    }

    .btn:active {
      transform: translateY(1px);
      box-shadow: none;
    }
    `
  ]
})
export class AppComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  loggedIn = false;

  constructor(private resolver: ComponentFactoryResolver) {}

  loadUserInfo() {
    this.container.clear(); 
    const userInfoFactory = this.resolver.resolveComponentFactory(UserInfoComponent);
    this.container.createComponent(userInfoFactory); 
  }

  loadLogin() {
    this.container.clear(); 
    const loginFactory = this.resolver.resolveComponentFactory(LoginComponent);
    const loginComponentRef: ComponentRef<LoginComponent> = this.container.createComponent(loginFactory);

    
    loginComponentRef.instance.loginSuccess.subscribe(() => {
      console.log('Login successful, updating loggedIn status');
      this.loggedIn = true; 
      this.container.clear(); 
    });
  }

  loadCreateOrder() {
    this.container.clear(); 
    const createOrderFactory = this.resolver.resolveComponentFactory(CreateOrderComponent);
    this.container.createComponent(createOrderFactory); 
  }

  loadMyOrders() {
    this.container.clear(); 
    const myOrdersFactory = this.resolver.resolveComponentFactory(MyOrdersComponent);
    this.container.createComponent(myOrdersFactory); 
  }
}
