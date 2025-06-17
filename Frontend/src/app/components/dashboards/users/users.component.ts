// import { Component, OnInit } from '@angular/core';
// import { UsersbookingsService } from '../../../services/usersbookings.service';
// import { CommonModule } from '@angular/common';

// interface Reservation {
//   bookingReference: string;
//   flight: {
//     flightNumber: string;
//     airline: string;
//     departureDateTime: Date;
//     arrivalDateTime: Date;
//   };
//   status: string;
//   totalAmount: number;
// }

// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   reservations: Reservation[];
//   // role: number; // 0 = User, 1 = Admin

// }

// @Component({
//   selector: 'app-users',
//   imports: [CommonModule],
//   templateUrl: './users.component.html',
//   styleUrl: './users.component.css'
// })
// export class UsersComponent implements OnInit {




//   users:User[]=[];
//   filteredUsers: User[] = [];

//    expandedUser: User |null = null;

//   constructor(private usersService :UsersbookingsService){}

//   ngOnInit(): void {
//     this.usersService.getUserswithReservation().subscribe(data=>{
//       this.users= data;
//       console.log(this.users);
//       //  this.filteredUsers = this.users.filter(user => user.role === 0); // ✅ Only show Users

//     });
//   }

//    toggleReservations(user: User): void {
//     this.expandedUser = this.expandedUser === user ? null : user; // Toggle table
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { UsersbookingsService } from '../../../services/usersbookings.service';
// import { CommonModule } from '@angular/common';

// interface Reservation {
//   bookingReference: string;
//   flight: {
//     flightNumber: string;
//     airline: string;
//     departureDateTime: Date;
//     arrivalDateTime: Date;
//   };
//   status: string;
//   totalAmount: number;
// }

// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   reservations: Reservation[];
  

// }

// @Component({
//   selector: 'app-users',
//   imports: [CommonModule],
//   templateUrl: './users.component.html',
//   styleUrl: './users.component.css'
// })
// export class UsersComponent implements OnInit {




//   users:User[]=[];
//   filteredUsers: User[] = [];

//    expandedUser: User |null = null;

//   constructor(private usersService :UsersbookingsService){}

//   ngOnInit(): void {
//     this.usersService.getUserswithReservation().subscribe(data=>{
//       this.users= data;
//       console.log(this.users);
      

//     });
//   }

//    toggleReservations(user: User): void {
//     this.expandedUser = this.expandedUser === user ? null : user; // Toggle table
//   }
// }


import { Component, OnInit } from '@angular/core';
import { UsersbookingsService } from '../../../services/usersbookings.service';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { FormsModule } from '@angular/forms';

interface Reservation {
  bookingReference: string;
  flight: {
    flightNumber: string;
    airline: string;
    departureDateTime: Date;
    arrivalDateTime: Date;
  };
  status: string;
  totalAmount: number;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  reservations: Reservation[];
}

@Component({
  selector: 'app-users',
  standalone: true, // Added standalone component declaration
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'], // Fixed: styleUrls instead of styleUrl (must be array)
  animations: [
    trigger('slideInOut', [
      state('in', style({ 
        height: '*', 
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('out', style({ 
        height: '0px', 
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition('out => in', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('in => out', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('buttonHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.05)' })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ])
  ]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  expandedUser: User | null = null;
  loading = true;
  hoveredButton: string | null = null;

  constructor(private usersService: UsersbookingsService) {}

  ngOnInit(): void {
    this.usersService.getUserswithReservation().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data; // Initialize filteredUsers
        this.loading = false;
        console.log(this.users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  // Helper method to get total reservations count
  getTotalReservations(): number {
    return this.users.reduce((sum, user) => sum + user.reservations.length, 0);
  }

  // Helper method to get user initials safely
  getUserInitials(user: User): string {
    const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial;
  }

  toggleReservations(user: User): void {
    this.expandedUser = this.expandedUser === user ? null : user;
  }

  onButtonHover(userEmail: string, isHovered: boolean): void {
    this.hoveredButton = isHovered ? userEmail : null;
  }

  getStatusClass(status: string): string {
     if (typeof status !== 'string') {
    console.warn('Invalid status:', status); // Debugging log
    return 'status-default'; // Fallback class
  }


    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getAirlineIcon(airline: string): string {
    const airlineMap: { [key: string]: string } = {
      'Air Canada': '✈️',
      'Air China': '🛫',
      'Air France': '✈️',
      'Air India': '🛩️',
      'Air India Express': '✈️',
      'Air New Zealand': '🛫',
      'AirAsia': '✈️',
      'AirAsia India': '🛩️',
      'Akasa Air': '🛫',
      'American Airlines': '🛩️',
      'British Airways': '✈️',
      'Cathay Pacific': '🛫',
      'Delta Airlines': '🛫',
      'EasyJet': '✈️',
      'Emirates': '✈️',
      'GoAir': '🛩️',
      'IndiGo': '🛫',
      'Japan Airlines': '✈️',
      'Lufthansa': '🛫',
      'Qantas': '🛩️',
      'Qatar Airways': '✈️',
      'Ryanair': '🛫',
      'Singapore Airlines': '✈️',
      'SpiceJet': '🛩️',
      'United Airlines': '✈️',
      'Vistara': '🛫'
    };
    return airlineMap[airline] || '✈️';
  }

  // Track by functions for better performance
  trackByUser(index: number, user: User): string {
    return user.email;
  }

  trackByReservation(index: number, reservation: Reservation): string {
    return reservation.bookingReference;
  }
}