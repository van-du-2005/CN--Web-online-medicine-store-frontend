import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { VerifyOtpComponent } from './features/auth/verify-otp/verify-otp';
import { AccountLayoutComponent } from './features/account/layout/account-layout.component';
import { ProfileComponent } from './features/account/profile/profile.component';
import { OrdersComponent } from './features/account/orders/orders.component';
import { AddressesComponent } from './features/account/addresses/addresses.component';

// Import từ nhánh hiện tại (Customer & Home)
import { CartComponent } from './features/Customer/cart/cart.component';
import { CheckoutComponent } from './features/Customer/checkout/checkout.component';
import { ProductDetailComponent } from './features/product-detail/product-detail';
import { HomeComponent } from './features/home/home';
import { CategoryComponent } from './features/category/category';

// Import từ nhánh được merge (Admin)
import { AdminLayoutComponent } from '../app/layouts/admin/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { OrdersAdminComponent } from './features/admin/orders/orders-admin.component';

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

  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersAdminComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  { path: '', component: HomeComponent }, // Khi vừa vào web sẽ hiển thị Trang Chủ
  { path: 'category', component: CategoryComponent },
  { path: 'product/detail/:id', component: ProductDetailComponent }
];
// Nhập khẩu 2 giao diện anh em mình đã làm
import { Thuoc } from './features/thuoc/thuoc';
import { DanhMuc } from './features/danhmuc/danhmuc';
import { NhaCungCap } from './features/nhacungcap/nhacungcap';
import { PhieuNhap } from './features/phieunhap/phieunhap';
export const routes: Routes = [
  // 1. Nếu vô trang chủ (localhost:4200), tự động đẩy sang trang Thuốc
  { path: '', redirectTo: 'thuoc', pathMatch: 'full' },
  
  // 2. Link localhost:4200/thuoc sẽ mở trang Quản lý Thuốc
  { path: 'thuoc', component: Thuoc },
  
  // 3. Link localhost:4200/danhmuc sẽ mở trang Quản lý Danh Mục
  { path: 'danhmuc', component: DanhMuc },
  { path: 'nhacungcap', component: NhaCungCap },
  { path: 'phieunhap', component: PhieuNhap }
];