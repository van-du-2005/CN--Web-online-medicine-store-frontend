import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage.service';
import { ApiResponse } from '../../../models/api-response.model';
import { OrderFilterCount, PagedOrderResult, OrderDetail } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/admin/order`;

  constructor(private http: HttpClient, private storage: StorageService) {}

  private getAuthHeaders() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.storage.getToken()}` }) };
  }

  getCounts(): Observable<ApiResponse<OrderFilterCount>> {
    return this.http.get<ApiResponse<OrderFilterCount>>(`${this.apiUrl}/counts`, this.getAuthHeaders());
  }

  getOrders(status: string = 'TatCa', page: number = 1, limit: number = 15): Observable<ApiResponse<PagedOrderResult>> {
    return this.http.get<ApiResponse<PagedOrderResult>>(`${this.apiUrl}?status=${status}&page=${page}&limit=${limit}`, this.getAuthHeaders());
  }

  getDetail(id: string): Observable<ApiResponse<OrderDetail>> {
    return this.http.get<ApiResponse<OrderDetail>>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/${id}/status`, `"${status}"`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getToken()}`,
        'Content-Type': 'application/json'
      })
    });
  }
}