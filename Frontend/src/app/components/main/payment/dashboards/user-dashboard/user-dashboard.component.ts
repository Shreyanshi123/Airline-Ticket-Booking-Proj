import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent  implements OnInit{
  users:any[]=[];
  loading: boolean = false;
  error: string = '';
 
  constructor(private userService: UsersService) { }
 
  ngOnInit(): void {
    this.loadUsers();
  }
 
  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) =>{ 
          console.log(data);
          this.users = data.items;
          console.log(this.users);
        },
        error: (err) => this.error = 'Failed to load users'
      });
  }
 
  deleteUser(userId: number): void {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
 
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user:any) => user.id !== userId);
        alert("User deleted successfully");
      },
      error: () => {
        alert("Failed to delete user");
      }
    });
  }
}