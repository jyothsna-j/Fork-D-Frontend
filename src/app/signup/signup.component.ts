import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private fb: FormBuilder, private authService: UserService, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ["CUSTOMER"]
    }, { validator: this.passwordMatchValidator });
    authService.getRole();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value.name);
      this.signupForm.removeControl('confirmPassword');
      this.authService.signup(this.signupForm.value).subscribe(
        (token: string) => {
          this.authService.setToken(token);
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        },
        error => {
          console.log('Signup failed. Try a different username.');
        }
      );
      this.signupForm.addControl('confirmPassword', new FormControl('', Validators.required));
    }
  }
}
