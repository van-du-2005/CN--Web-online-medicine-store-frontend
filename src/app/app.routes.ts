import { Routes } from '@angular/router';

// ------------------- AUTH LAYOUT & FEATURES -------------------
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { VerifyOtpComponent } from './features/auth/verify-otp/verify-otp';

// ------------------- CUSTOMER ACCOUNT FEATURES -------------------
import { AccountLayoutComponent } from './features/account/layout/account-layout.component';
import { ProfileComponent } from './features/account/profile/profile.component';
import { OrdersComponent } from './features/account/orders/orders.component';
import { AddressesComponent } from './features/account/addresses/addresses.component';

// ------------------- CUSTOMER MARKETPLACE FEATURES -------------------
import { HomeComponent } from './features/home/home';
import { CategoryComponent } from './features/category/category';
import { ProductDetailComponent } from './features/product-detail/product-detail';
import { CartComponent } from './features/Customer/cart/cart.component';
import { CheckoutComponent } from './features/Customer/checkout/checkout.component';

// ------------------- ADMIN SYSTEM FEATURES -------------------
import { AdminLayoutComponent } from '../app/layouts/admin/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { OrdersAdminComponent } from './features/admin/orders/orders-admin.component';
import { Thuoc } from './features/thuoc/thuoc';
import { DanhMuc } from './features/danhmuc/danhmuc';
import { NhaCungCap } from './features/nhacungcap/nhacungcap';
import { PhieuNhap } from './features/phieunhap/phieunhap';

export const routes: Routes = [
  // =========================================================================
  // 1. NHÓM ROUTE KHÁCH HÀNG (CUSTOMER & MARKETPLACE)
  // =========================================================================
  { path: '', component: HomeComponent }, // Vào web hiển thị luôn trang chủ của khách
  { path: 'category', component: CategoryComponent },
  { path: 'product/detail/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },

  // =========================================================================
  // 2. NHÓM ROUTE XÁC THỰC (AUTHENTICATION)
  // =========================================================================
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'verify-otp', component: VerifyOtpComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // =========================================================================
  // 3. NHÓM ROUTE TÀI KHOẢN KHÁCH HÀNG (USER ACCOUNT PROFILE)
  // =========================================================================
  {
    path: 'account',
    component: AccountLayoutComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'addresses', component: AddressesComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },

  // =========================================================================
  // 4. NHÓM ROUTE QUẢN TRỊ VIÊN (ADMIN DASHBOARD & MANAGEMENT)
  // =========================================================================
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersAdminComponent },
      
      // Hợp nhất các route quản lý danh mục cốt lõi vào layout Admin làm route con
      { path: 'thuoc', component: Thuoc },
      { path: 'danhmuc', component: DanhMuc },
      { path: 'nhacungcap', component: NhaCungCap },
      { path: 'phieunhap', component: PhieuNhap },
      
      // Nếu truy cập /admin mà để trống, tự động chuyển đến trang dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // =========================================================================
  // 5. ĐIỀU HƯỚNG BẢO VỆ (FALLBACK ROUTE)
  // =========================================================================
  // Nếu gõ bừa một đường dẫn không tồn tại, tự động đá ngược về Trang Chủ khách hàng
  { path: '**', redirectTo: '', pathMatch: 'full' }
];