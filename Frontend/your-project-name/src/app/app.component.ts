import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { UserInfoComponent } from './user-info/user-info.component';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true, // Mark the component as standalone
  template: `
    <div class="container">
      <h1>Welcome to Our Application</h1>
      <div class="button-group">
        <button class="btn" (click)="loadUserInfo()">Register</button>
        <button class="btn secondary" (click)="loadLogin()">Login</button>
      </div>
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

  constructor(private resolver: ComponentFactoryResolver) {}

  loadUserInfo() {
    this.container.clear(); // Clear the previous component
    const userInfoFactory = this.resolver.resolveComponentFactory(UserInfoComponent);
    this.container.createComponent(userInfoFactory); // Load UserInfoComponent
  }

  loadLogin() {
    this.container.clear(); // Clear the previous component
    const loginFactory = this.resolver.resolveComponentFactory(LoginComponent);
    this.container.createComponent(loginFactory); // Load LoginComponent
  }
}
