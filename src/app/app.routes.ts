import { Routes } from '@angular/router';
import { ProductDetailComponent } from './features/product-detail/product-detail';
import { HomeComponent } from './features/home/home';
import { CategoryComponent } from './features/category/category';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Khi vừa vào web sẽ hiển thị Trang Chủ
  { path: 'category', component: CategoryComponent },
  { path: 'product/detail/:id', component: ProductDetailComponent }
];
