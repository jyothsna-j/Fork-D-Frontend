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

  getRestaurants() : Observable<HttpResponse<ApiResponse<any>>>{
    let URL:string = this.baseURL + 'restaurants';
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  fetchRestaurantImage(id: number) {
    let URL: string = this.baseURL + 'restaurants/image/' + id
    return this.http.get(URL, { responseType: 'blob' });
  }

  getRestaurantById(id: number) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurants/' + id;
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  getRestaurantAddress(id: number) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurants/' + id + '/address'
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  getRestaurantByUserId(id: number) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurants/user/' + id;
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  updateRestaurantImage(id: number, formData: any) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurants/images/' + id;
    return this.http.put<ApiResponse<any>>(URL, formData, {observe: 'response'});
  }

  updateRestaurantCuisine(id: number, payload: any) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurants/cuisine/' + id;
    return this.http.put<ApiResponse<any>>(URL, payload, {observe: 'response'});
  }

  //TODO -  Observable<ApiResponse<User[]>  this.http.get<ApiResponse<User[]>>(this.apiUrl); 
  getDishes(id: number) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurant/' + id + '/dishes';
    return this.http.get<ApiResponse<any>>(URL, {observe: 'response'});
  }

  addDish(id: number, payload: any) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurant/' + id + '/dishes';
    return this.http.post<ApiResponse<any>>(URL, payload, {observe: 'response'});
  }

  updateDish(id: number, payload: any) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurant/' + id + '/dishes';
    return this.http.put<ApiResponse<any>>(URL, payload, {observe: 'response'});
  }

  deleteDish(restaurantId: number, dishId: number) : Observable<HttpResponse<ApiResponse<any>>>{
    let URL: string = this.baseURL + 'restaurant/' + restaurantId + '/dishes/' + dishId;
    return this.http.delete<ApiResponse<any>>(URL, {observe: 'response'});
  }

}
