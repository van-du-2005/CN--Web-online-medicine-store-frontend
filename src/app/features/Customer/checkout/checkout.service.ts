import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutInterface } from './checkout.model';
import { StorageService } from '../../../services/storage.service';
import { CartDto } from '../cart/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  
  private apiUrl = 'http://localhost:5237/api/checkout'; 
  private cartApiUrl = 'http://localhost:5237/api/cart'; 

  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // HÀM BỔ SUNG: Gọi sang API Backend để lấy dữ liệu từ file CartService (C#)
  getCartFromBackend(): Observable<{ success: boolean, data: CartDto }> {
    return this.http.get<{ success: boolean, data: CartDto }>(this.cartApiUrl, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  processCheckout(checkoutData: CheckoutInterface): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process`, checkoutData, {
      headers: this.getAuthHeaders(),
      withCredentials: true 
    });
  }
}