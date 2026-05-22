//----------GỌI API ĐẾN BACKEND CHO CART------------------
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartDto } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5237/api/cart'; 

  getCart(): Observable<{ success: boolean, data: CartDto }> {
    return this.http.get<any>(this.apiUrl);
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-quantity`, { productId, quantity });
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove-item/${productId}`);
  }
}