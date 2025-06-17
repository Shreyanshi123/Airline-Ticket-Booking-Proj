// import { Component } from '@angular/core';
// import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-admin-layout',
//   imports: [AdminSidebarComponent,RouterOutlet],
//   templateUrl: './admin-layout.component.html',
//   styleUrl: './admin-layout.component.css'
// })
// export class AdminLayoutComponent {

// }


// import { CommonModule } from '@angular/common';

// import { Component, OnInit, HostListener } from '@angular/core';

// import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

// import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

// import { filter } from 'rxjs/operators';
 
// @Component({

//   selector: 'app-admin-layout',

//   imports: [AdminSidebarComponent, RouterOutlet, CommonModule],

//   templateUrl: './admin-layout.component.html',

//   styleUrl: './admin-layout.component.css'

// })

// export class AdminLayoutComponent implements OnInit {

//   sidebarOpen = false;

//   isMobile = false;

//   showDefaultContent = true;
 
//   // Mock data for dashboard

//   dashboardStats = [

//     {

//       icon: '✈️',

//       value: '2,847',

//       label: 'Total Flights',

//       change: '+12.5%',

//       changeType: 'positive',

//       color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

//     },

//     {

//       icon: '👥',

//       value: '18,425',

//       label: 'Active Users',

//       change: '+8.2%',

//       changeType: 'positive',

//       color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'

//     },

//     {

//       icon: '🎫',

//       value: '5,632',

//       label: 'Bookings Today',

//       change: '-2.4%',

//       changeType: 'negative',

//       color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'

//     },

//     {

//       icon: '💰',

//       value: '$234,567',

//       label: 'Revenue',

//       change: '+15.3%',

//       changeType: 'positive',

//       color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'

//     }

//   ];
 
//   popularDestinations = [

//     { flag: '🇺🇸', name: 'New York', bookings: 1245, percentage: 85 },

//     { flag: '🇬🇧', name: 'London', bookings: 987, percentage: 68 },

//     { flag: '🇫🇷', name: 'Paris', bookings: 856, percentage: 58 },

//     { flag: '🇯🇵', name: 'Tokyo', bookings: 743, percentage: 51 },

//     { flag: '🇩🇪', name: 'Berlin', bookings: 634, percentage: 43 },

//     { flag: '🇮🇹', name: 'Rome', bookings: 521, percentage: 36 }

//   ];
 
//   recentActivities = [

//     {

//       icon: '👤',

//       iconColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

//       text: 'New user registration: john.doe@email.com',

//       time: '2 minutes ago'

//     },

//     {

//       icon: '✈️',

//       iconColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',

//       text: 'Flight NYC-LAX scheduled successfully',

//       time: '15 minutes ago'

//     },

//     {

//       icon: '🎫',

//       iconColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',

//       text: 'Booking confirmation sent to customer',

//       time: '32 minutes ago'

//     },

//     {

//       icon: '📊',

//       iconColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',

//       text: 'Weekly analytics report generated',

//       time: '1 hour ago'

//     },

//     {

//       icon: '⚠️',

//       iconColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',

//       text: 'System maintenance scheduled for tonight',

//       time: '2 hours ago'

//     }

//   ];
 
//   constructor(private router: Router) {}
 
//   ngOnInit() {

//     this.checkScreenSize();

//     this.checkRouteForDefaultContent();

//     // Listen to route changes to determine if we should show default content

//     this.router.events

//       .pipe(filter(event => event instanceof NavigationEnd))

//       .subscribe((event: NavigationEnd) => {

//         this.checkRouteForDefaultContent();

//       });

//   }
 
//   @HostListener('window:resize', ['$event'])

//   onResize(event: any) {

//     this.checkScreenSize();

//   }
 
//   private checkScreenSize() {

//     this.isMobile = window.innerWidth <= 768;

//     if (!this.isMobile) {

//       this.sidebarOpen = false;

//     }

//   }
 
//   private checkRouteForDefaultContent() {

//     // Show default content only on main dashboard route

//     const currentRoute = this.router.url;

//     this.showDefaultContent = currentRoute === '/dashboard' || currentRoute === '/admin';

//   }
 
//   toggleSidebar() {

//     this.sidebarOpen = !this.sidebarOpen;

//   }
 
//   closeSidebar() {

//     if (this.isMobile) {

//       this.sidebarOpen = false;

//     }

//   }

// }


import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminSidebarComponent, RouterOutlet, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen = false;
  isMobile = false;
  showDefaultContent = true;

  // Mock data for dashboard
  dashboardStats = [
    { icon: '✈️', value: '2,847', label: 'Total Flights', change: '+12.5%', changeType: 'positive', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { icon: '👥', value: '18,425', label: 'Active Users', change: '+8.2%', changeType: 'positive', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { icon: '🎫', value: '5,632', label: 'Bookings Today', change: '-2.4%', changeType: 'negative', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { icon: '💰', value: '$234,567', label: 'Revenue', change: '+15.3%', changeType: 'positive', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];

  popularDestinations = [
    { flag: '🇺🇸', name: 'New York', bookings: 1245, percentage: 85 },
    { flag: '🇬🇧', name: 'London', bookings: 987, percentage: 68 },
    { flag: '🇫🇷', name: 'Paris', bookings: 856, percentage: 58 },
    { flag: '🇯🇵', name: 'Tokyo', bookings: 743, percentage: 51 },
    { flag: '🇩🇪', name: 'Berlin', bookings: 634, percentage: 43 },
    { flag: '🇮🇹', name: 'Rome', bookings: 521, percentage: 36 }
  ];

  recentActivities = [
    { icon: '👤', iconColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: 'New user registration: john.doe@email.com', time: '2 minutes ago' },
    { icon: '✈️', iconColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: 'Flight NYC-LAX scheduled successfully', time: '15 minutes ago' },
    { icon: '🎫', iconColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: 'Booking confirmation sent to customer', time: '32 minutes ago' },
    { icon: '📊', iconColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: 'Weekly analytics report generated', time: '1 hour ago' },
    { icon: '⚠️', iconColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: 'System maintenance scheduled for tonight', time: '2 hours ago' }
  ];

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}
  // constructor(private router: Router) {}

  ngOnInit() {
    this.checkScreenSize();
    this.checkRouteForDefaultContent();
     this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.sidebarOpen = false; // ✅ Close sidebar on navigation
    });


    console.log("Dashboard Stats:", this.dashboardStats);
    console.log("Popular Destinations:", this.popularDestinations);
    console.log("Recent Activities:", this.recentActivities);

     this.cdRef.detectChanges();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.checkRouteForDefaultContent();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  private checkRouteForDefaultContent() {
    const currentRoute = this.router.url;
    this.showDefaultContent = currentRoute.startsWith('/dashboard');
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
 