import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UEngageServiceService {

  private baseURL = environment.NG_APP_BASE_URL + 'uengage';

  constructor(private http: HttpClient) { }

  getServiceability(payload: any) : Observable<any>{
    let URL: string = this.baseURL + '/getServiceability';
    return this.http.post<any>(URL, payload, {observe: 'response'});
  }
}
