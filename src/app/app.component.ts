import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'forkd';

  isLoggedIn: boolean = false;
  user: string | null = '';
  role: string| null = '';

  constructor(private authService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUsername();
    this.role = this.authService.getRole();
  } 

  goHome(){
    this.router.navigate(['']);
  }
  openLogin() {
    this.router.navigate(['/login']);
  }

  openSignup() {
    this.router.navigate(['/signup']);
  }

  orders(){
    this.router.navigate(['orders']);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }
}
