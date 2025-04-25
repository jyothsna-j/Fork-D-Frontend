import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private _snackBar = inject(MatSnackBar);
  
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
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next:(response) => {
          if(response.body){
            this.authService.setToken(response.body.data);
            let role = this.authService.getRole();
            if(role=='CUSTOMER'){
              this.router.navigate(['']).then(() => {
                window.location.reload();
              });
            }
            if(role=='VENDOR'){
              this.router.navigate(['vendor/live-orders']).then(() => {
                window.location.reload();
              });
            }
          }
        },
        error: (error) => {
          console.log(error);
          this._snackBar.open(error.error.message, 'Dismiss', {
            duration: 3000
          })
        }
      });
    }
  }

}
