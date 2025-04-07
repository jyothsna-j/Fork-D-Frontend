import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../_utils/api-response';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  baseURL : string | undefined = environment.NG_APP_BASE_URL;

  constructor(private http: HttpClient) { }

  getRestaurants() : Observable<any>{
    let URL:string = this.baseURL + 'restaurants';
    return this.http.get<any>(URL);
  }

  getRestaurantById(id: number) : Observable<any>{
    let URL: string = this.baseURL + 'restaurants/' + id;
    return this.http.get<any>(URL);
  }

  //TODO -  Observable<ApiResponse<User[]>  this.http.get<ApiResponse<User[]>>(this.apiUrl); 
  getDishes(id: number) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurant/' + id + '/dishes';
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  addDish(id: number, payload: any) : Observable<HttpResponse<String>>{
    let URL: string = this.baseURL + 'restaurant/' + id + '/dishes';
    return this.http.post<String>(URL, payload, {observe: 'response'});
  }

  updateDish(id: number, payload: any) : Observable<HttpResponse<String>>{
    let URL: string = this.baseURL + 'restaurant/' + id + '/dishes';
    return this.http.put<String>(URL, payload, {observe: 'response'});
  }

  deleteDish(restaurantId: number, dishId: number) : Observable<HttpResponse<String>>{
    let URL: string = this.baseURL + 'restaurant/' + restaurantId + '/dishes/' + dishId;
    return this.http.delete<String>(URL, {observe: 'response'});
  }

  postImage(formData: any){
    let URL: string = this.baseURL + 'restaurants'
    this.http.put(URL, formData).subscribe({
      next: (res) => console.log('Upload Successful', res),
      error: (err) => console.error('Upload Failed', err),
    })
  }

  fetchImage(id: number) {
    let URL: string = this.baseURL + 'restaurants/image/' + id
    return this.http.get(URL, { responseType: 'blob' });
  }
}
