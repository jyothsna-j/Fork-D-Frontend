import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../_utils/api-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseURL : string = environment.NG_APP_BASE_URL +"orders"

  constructor(private http: HttpClient) { }

  getOrders() : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL;
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  getOrdersByCustomerId(userId: any) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + '/user/' + userId;
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  getOrdersByRestaurantId(restaurantId: any) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + '/restaurant/' + restaurantId;
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  getOrdersForApproval() : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + '/approve-payment';
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  postOrder(order: any) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL
    return this.http.post<ApiResponse<any>>(URL, order, {observe: 'response'});
  }

  updateOrderStatus(id: number, status: String) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL = this.baseURL +'/' + id + '/update-status/' + status;
    return this.http.put<ApiResponse<any>>(URL, null, {observe: 'response'});
  }

  getRiderDetails(id: any): Observable<HttpResponse<ApiResponse<any>>>{
    let URL = this.baseURL +'/' + id + '/rider-details';
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }
}
