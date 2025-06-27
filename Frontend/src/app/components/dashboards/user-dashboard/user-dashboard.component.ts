// import { Component, OnInit } from '@angular/core';
// import { finalize } from 'rxjs/operators';
// import { UsersService } from '../../../services/users.service';
// import { CommonModule } from '@angular/common';




// @Component({
//   selector: 'app-user-dashboard',
//   imports: [CommonModule],
//   templateUrl: './user-dashboard.component.html',
//   styleUrl: './user-dashboard.component.css'
// })
// export class UserDashboardComponent  implements OnInit{
//   users:any[]=[];
//   loading: boolean = false;
//   error: string = '';
 
//   constructor(private userService: UsersService) { }
 
//   ngOnInit(): void {
//     this.loadUsers();
//   }
 
//   loadUsers(): void {
//     this.loading = true;
//     this.userService.getAllUsers()
//       .pipe(finalize(() => this.loading = false))
//       .subscribe({
//         next: (data) =>{ 
//           console.log(data);
//           this.users = data.items;
//           console.log(this.users);
//         },
//         error: (err) => this.error = 'Failed to load users'
//       });
//   }
 
//   deleteUser(userId: number): void {
//     if (!confirm("Are you sure you want to delete this user?")) {
//       return;
//     }
 
//     this.userService.deleteUser(userId).subscribe({
//       next: () => {
//         this.users = this.users.filter((user:any) => user.id !== userId);
//         alert("User deleted successfully");
//       },
//       error: () => {
//         alert("Failed to delete user");
//       }
//     });
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { finalize } from 'rxjs/operators';
// import { UsersService } from '../../../services/users.service';
// import { CommonModule } from '@angular/common';




// @Component({
//   selector: 'app-user-dashboard',
//   imports: [CommonModule],
//   templateUrl: './user-dashboard.component.html',
//   styleUrl: './user-dashboard.component.css'
// })
// export class UserDashboardComponent  implements OnInit{
//   users:any[]=[];
//   loading: boolean = false;
//   error: string = '';
 
//   constructor(private userService: UsersService) { }
 
//   ngOnInit(): void {
//     this.loadUsers();
//   }
 
//   loadUsers(): void {
//     this.loading = true;
//     this.userService.getAllUsers()
//       .pipe(finalize(() => this.loading = false))
//       .subscribe({
//         next: (data) =>{ 
//           console.log(data);
//           this.users = data.items;
//           console.log(this.users);
//         },
//         error: (err) => this.error = 'Failed to load users'
//       });
//   }
 
//   deleteUser(userId: number): void {
//     if (!confirm("Are you sure you want to delete this user?")) {
//       return;
//     }
 
//     this.userService.deleteUser(userId).subscribe({
//       next: () => {
//         this.users = this.users.filter((user:any) => user.id !== userId);
//         alert("User deleted successfully");
//       },
//       error: () => {
//         alert("Failed to delete user");
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  animations: [
    // Fade in animation
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Slide in animation
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Slide in row animation
    trigger('slideInRow', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateX(-50px)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)'
        }),
        animate('{{delay}}ms ease-out', style({ 
          opacity: 1, 
          transform: 'translateX(0)',
          backgroundColor: 'transparent'
        }))
      ])
    ]),

    // Toast slide animation
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class UserDashboardComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading: boolean = false;
  error: string = '';
  searchTerm: string = '';
  deletingUserId: number | null = null;
  
  // Toast notifications
  showSuccessToast: boolean = false;
  showErrorToast: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

// Edit user state
  editingUser: any | null = null;
  editUserData: any = { firstName: '', lastName: '', email: '', phoneNumber: '', role: 0 };



  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.userService.getAllUsers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => { 
          console.log(data);
          this.users = data.items;
          this.filteredUsers = [...this.users];
          this.onSearch(); // Apply current search filter
          console.log(this.users);
        },
        error: (err) => {
          this.error = 'Failed to load users';
          this.showErrorNotification('Failed to load users. Please try again.');
        }
      });
  }

//  // Open edit form
//   openEditForm(user: any): void {
//     this.editingUser = user;
//     this.editUserData = { ...user }; // Clone user data
//   }


  deleteUser(userId: number): void {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    this.deletingUserId = userId;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user: any) => user.id !== userId);
        this.filteredUsers = this.filteredUsers.filter((user: any) => user.id !== userId);
        this.deletingUserId = null;
        this.showSuccessNotification("User deleted successfully!");
      },
      error: () => {
        this.deletingUserId = null;
        this.showErrorNotification("Failed to delete user. Please try again.");
      }
    });
  }

  // New methods for enhanced functionality
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.role === 0 ? 'user' : 'admin').includes(searchLower)
    );
  }

  getAdminCount(): number {
    return this.users.filter(user => user.role === 1).length;
  }

  editUser(user: any): void {
    // Placeholder for edit functionality - you can implement this later
    console.log('Edit user:', user);
    this.showSuccessNotification(`Edit functionality for ${user.firstName} ${user.lastName} - Coming soon!`);
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }

  // Toast notification methods
  showSuccessNotification(message: string): void {
    this.successMessage = message;
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 4000);
  }

  showErrorNotification(message: string): void {
    this.errorMessage = message;
    this.showErrorToast = true;
    setTimeout(() => {
      this.showErrorToast = false;
    }, 4000);
  }
}