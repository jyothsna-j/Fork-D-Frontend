import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL: string =  environment.NG_APP_BASE_URL + 'auth';

  constructor(private http: HttpClient) { }

  signup(user: any){
    console.log(user)
    let URL: string = this.baseURL + '/signup'
    localStorage.setItem('user', user.username);
    return this.http.post(URL, user, { responseType: 'text' })
  }

  login(username: string, password: string){
    let URL: string = this.baseURL + '/login'
    localStorage.setItem('user', username);
    return this.http.post(URL, { username, password }, { responseType: 'text' })
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getUsername(): string | null {
    return localStorage.getItem('user')
  }

  isLoggedIn(): boolean {
    console.log()
    return !!localStorage.getItem('jwt');
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    // Decode token payload (not secure for production use; consider a proper library)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    // Decode token payload (not secure for production use; consider a proper library)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user')
  }
}
