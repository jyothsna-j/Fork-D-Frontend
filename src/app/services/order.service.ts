import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseURL : string = environment.NG_APP_BASE_URL +"orders"

  constructor(private http: HttpClient) { }

  getOrdersByCustomerId(userId: any){
    let URL: string = this.baseURL + '/user/' + userId;
    return this.http.get<any>(URL);
  }

  getOrdersByRestaurantId(restaurantId: any){
    let URL: string = this.baseURL + '/restaurant/' + restaurantId;
    return this.http.get<any>(URL);
  }

  getOrdersForApproval(){
    let URL: string = this.baseURL + '/approve-payment';
    return this.http.get<any>(URL);
  }

  postOrder(order: any){
    let URL: string = this.baseURL
    this.http.post(URL, order).subscribe({
      next: (res) => console.log('Upload Successful', res),
      error: (err) => console.error('Upload Failed', err),
    })
  }

  updateOrderStatus(id: number, status: String){
    let URL = this.baseURL +'/' + id + '/update-status/' + status;
    this.http.put(URL, null).subscribe({
      next: (res) => console.log('Upload Successful', res),
      error: (err) => console.error('Upload Failed', err),
    });
  }
}
