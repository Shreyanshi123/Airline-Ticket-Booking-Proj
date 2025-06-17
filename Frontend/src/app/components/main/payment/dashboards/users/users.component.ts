import { Component, OnInit } from '@angular/core';
import { UsersbookingsService } from '../../../services/usersbookings.service';
import { CommonModule } from '@angular/common';

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
  // role: number; // 0 = User, 1 = Admin

}

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {




  users:User[]=[];
  filteredUsers: User[] = [];

   expandedUser: User |null = null;

  constructor(private usersService :UsersbookingsService){}

  ngOnInit(): void {
    this.usersService.getUserswithReservation().subscribe(data=>{
      this.users= data;
      console.log(this.users);
      //  this.filteredUsers = this.users.filter(user => user.role === 0); // ✅ Only show Users

    });
  }

   toggleReservations(user: User): void {
    this.expandedUser = this.expandedUser === user ? null : user; // Toggle table
  }
}


