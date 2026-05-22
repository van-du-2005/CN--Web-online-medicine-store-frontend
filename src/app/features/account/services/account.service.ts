import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../models/api-response.model';
import { StorageService } from '../../../services/storage.service';
import { UserProfile, ChangePassword, Address, OrderHistory } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/api/accountd`;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {}

  // Hàm tự động gắn Token
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.storage.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`, this.getAuthHeaders());
  }

  updateProfile(dto: UserProfile): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/profile`, dto, this.getAuthHeaders());
  }

  changePassword(dto: ChangePassword): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.apiUrl}/change-password`,
      dto,
      this.getAuthHeaders(),
    );
  }

  getOrders(filter: string = 'TatCa'): Observable<ApiResponse<OrderHistory[]>> {
    return this.http.get<ApiResponse<OrderHistory[]>>(
      `${this.apiUrl}/orders?filter=${filter}`,
      this.getAuthHeaders(),
    );
  }

  cancelOrder(orderId: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/orders/${orderId}/cancel`,
      {},
      this.getAuthHeaders(),
    );
  }

  getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(`${this.apiUrl}/addresses`, this.getAuthHeaders());
  }

  addAddress(dto: Address): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/addresses`,
      dto,
      this.getAuthHeaders(),
    );
  }

  deleteAddress(addressId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/addresses/${addressId}`,
      this.getAuthHeaders(),
    );
  }

  setDefaultAddress(addressId: string): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.apiUrl}/addresses/${addressId}/default`,
      {},
      this.getAuthHeaders(),
    );
  }
}
