import { Routes } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { LoginComponent } from './login/login.component'; 
import { AssignedOrdersComponent } from './assigned-orders/assigned-orders.component';

export const routes: Routes = [
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'assigned-orders', component: AssignedOrdersComponent },  // Added route
  { path: '', component: LoginComponent, pathMatch: 'full' }, 
  { path: '**', redirectTo: '' } 
];
