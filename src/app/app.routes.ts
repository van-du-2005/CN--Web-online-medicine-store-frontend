//  import { Routes } from '@angular/router';


// export const routes: Routes = [];

import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { VerifyOtpComponent } from './features/auth/verify-otp/verify-otp';
import { AccountLayoutComponent } from './features/account/layout/account-layout.component';
import { ProfileComponent } from './features/account/profile/profile.component';
import { OrdersComponent } from './features/account/orders/orders.component';
import { AddressesComponent } from './features/account/addresses/addresses.component';
import { CartComponent } from './features/Customer/cart/cart.component';

export const routes: Routes = [
  {
    // Route: auth
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      // Các route con sẽ được nhúng vào <router-outlet> của AuthLayout
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'verify-otp', component: VerifyOtpComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  {
    // Feature: Account (Dùng Layout riêng chứa Sidebar)
    path: 'account',
    component: AccountLayoutComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'addresses', component: AddressesComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  
  { path: 'profile', redirectTo: 'account/profile', pathMatch: 'full' },

  { 
    // Tạm thời điều hướng trang chủ (localhost:4200) thẳng vào trang đăng nhập để dễ test
    path: '', redirectTo: 'auth/login', pathMatch: 'full' 
  }
];


export const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent
  }
];
