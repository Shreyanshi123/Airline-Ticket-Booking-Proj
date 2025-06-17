import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule,RouterLink],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  menuItems = [
    { name: 'Admin Dashboard', route: '/dashboard', icon: '🏠' },
    { name: 'Users Management', route: '/dashboard/users', icon: '👥' },
    { name: 'User Analytics', route: '/dashboard/user-analytics', icon: '💡' },
    {name:'User Reservations', route:'/dashboard/userswithreservations',icon: '💡'},
      { name: 'Schedule Flights', route: '/dashboard/dashboard/schedule', icon: '🕒' },
    { name: ' Booking Analytics', route: '/dashboard/admin-analytics', icon: '📊' },
    { name: 'Popular Flights Analytics', route: '/dashboard/popularFlights', icon: '✈️' },
  
    
  ];
}

