import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent {

  private _snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['position', 'username', 'name', 'email'];

  users: any;
  
  constructor(private userService: UserService){ }

  ngOnInit(){
    this.getUsers();
  }

  getUsers(){
    this.userService.getUsers().subscribe({
      next: (response) => {
        if(response.body===null){
          this._snackBar.open('Users not found', 'Dismiss', {duration: 3000})
        }
        else{
          this.users = response.body.data;
          console.log(this.users);
        }
      },
      error: (error: any) => {
        console.log(error);
        this._snackBar.open(error.error.message, 'Dismiss', {duration: 3000})
      }
    });
  }
}
