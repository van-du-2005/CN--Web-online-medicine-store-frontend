//----------GỌI API ĐẾN BACKEND CHO CART------------------
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartDto } from './cart.model';
import { StorageService } from '../../../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  private apiUrl = 'http://localhost:5237/api/cart';

  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      //'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCart(): Observable<{ success: boolean, data: CartDto }> {
    return this.http.get<{ success: boolean, data: CartDto }>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    })
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    const body = { productId, quantity }; 

    return this.http.put<any>(`${this.apiUrl}/update-quantity`, body, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove-item/${productId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    const body = { productId, quantity };
    return this.http.post<any>(`${this.apiUrl}/add`, body, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}