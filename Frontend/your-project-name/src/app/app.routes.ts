import { Routes } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { LoginComponent } from './login/login.component'; 

export const routes: Routes = [
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' }, 
  { path: '**', redirectTo: '' } 
];
