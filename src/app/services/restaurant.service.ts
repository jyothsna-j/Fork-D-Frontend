import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  getDishes(id: number) : Observable<any>{
    let URL: string = this.baseURL + 'restaurant/' + id + '/dishes';
    return this.http.get<any>(URL);
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
