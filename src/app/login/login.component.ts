import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
    hidePassword = true;
  
    constructor(private fb: FormBuilder, private authService: UserService, private router: Router) {
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
      authService.getRole();
    }
  
    onSubmit() {
      if (this.loginForm.valid) {
        console.log('Form Submitted', this.loginForm.value.name);
        this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
          (token: string) => {
            this.authService.setToken(token);
            let role = this.authService.getRole();
            if(role=='CUSTOMER'){
              this.router.navigate(['']).then(() => {
                window.location.reload();
              });
            }
            if(role=='VENDOR'){
              this.router.navigate(['vendor/edit']).then(() => {
                window.location.reload();
              });
            }
          },
          error => {
            console.log('Login failed. Try Again');
          }
        );
      }
    }

}
