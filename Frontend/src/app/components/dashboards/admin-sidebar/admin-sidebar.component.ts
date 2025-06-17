import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
 
@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent implements OnInit {
  
menuItems = [
  { name: 'Admin Dashboard', route: '/dashboard', icon: '🏠' }, // Home
  { name: 'Users Management', route: '/dashboard/users', icon: '👤' }, // Single User
  { name: 'User Analytics', route: '/dashboard/user-analytics', icon: '📊' }, // Analytics Graph
  { name: 'User Reservations', route: '/dashboard/userswithreservations', icon: '📝' }, // Document/Reservations
  { name: 'Reservation Charts', route: '/dashboard/chart', icon: '📉' }, // Chart Downward
  { name: 'Schedule Flights', route: '/dashboard/schedule', icon: '🛫' }, // Plane Taking Off
  { name: 'Booking Analytics', route: '/dashboard/admin-analytics', icon: '📈' }, // Chart Upward
  { name: 'Popular Flights Analytics', route: '/dashboard/popularFlights', icon: '🌍' }, // Globe for Popular Flights
];
 
  isMobile = false;
  sidebarOpen = false;
   adminName: string = 'Admin'; // Default name

  constructor(private authService: AuthService, private router: Router) {}

 
  ngOnInit() {
    this.checkScreenSize();
    this.adminName = this.authService.getUserName(); // ✅ Fetch admin name
  }
 
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }
 
  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.sidebarOpen = true;
    }
  }
 
  logout() {
    this.authService.signOut(); // ✅ Clear authentication data
    this.router.navigate(['dashboard/login']); // ✅ Redirect to login page
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
 
  closeSidebar() {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }
}
 