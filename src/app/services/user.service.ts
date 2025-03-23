import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL: string = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  signup(username: string, password: string, role: string){
    let URL: string = this.baseURL + '/signup'
    return this.http.post(URL, { username, password, role }, { responseType: 'text' })
  }

  login(username: string, password: string){
    let URL: string = this.baseURL + '/login'
    return this.http.post(URL, { username, password }, { responseType: 'text' })
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
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

  logout() {
    localStorage.removeItem('jwt');
  }
}
