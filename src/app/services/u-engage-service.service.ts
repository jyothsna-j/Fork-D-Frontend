import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UEngageServiceService {

  private token = 'grdgedhs'
  private baseURL = 'https://riderapi-staging.uengage.in/';

  constructor(private http: HttpClient) { }

  getServiceability(payload: any){
    let URL: string = this.baseURL + 'getServiceability';
    return this.http.post<any>(URL, payload);
  }
}
