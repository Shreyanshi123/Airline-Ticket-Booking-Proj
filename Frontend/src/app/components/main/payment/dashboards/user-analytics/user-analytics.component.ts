
// import { Component, OnInit } from '@angular/core';
// import { RecentUserService } from '../../../recent-user.service';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { CommonModule } from '@angular/common';
 
// @Component({
//   selector: 'app-user-analytics',
//   standalone:true,
//   imports: [NgxChartsModule,CommonModule],
//   templateUrl: './user-analytics.component.html'
// })
// export class UserAnalyticsComponent implements OnInit {
//   recentUsers: any[] = [];
//   userSignupData: any[] = [];
//   roleDistribution: any[] = [];
//   activeUserData: any[] = [];
 
//   constructor(private recentUserService: RecentUserService) {}
 
//   ngOnInit(): void {
//     this.loadRecentUsers();
//   }
 
//   loadRecentUsers(): void {
//     this.recentUserService.getRecentUsers().subscribe(users => {
//       this.recentUsers = users;
 
//       // Build Signup Trends
//       const signupMap: { [key: string]: number } = {};
//       users.forEach(user => {
//         const date = user.createdAt.split('T')[0];
//         signupMap[date] = (signupMap[date] || 0) + 1;
//       });
//       this.userSignupData = Object.keys(signupMap).map(date => ({
//         name: date,
//         value: signupMap[date]
//       }));
 
//       // Build Role Distribution
//       const roles = { Admin: 0, User: 0 };
//       users.forEach(u => {
//         if (u.role === 1) roles.Admin++;
//         else roles.User++;
//       });
//       this.roleDistribution = [
//         { name: 'Admin', value: roles.Admin },
//         { name: 'User', value: roles.User }
//       ];
 
//       // Build Active User Count (logged in today)
//       const today = new Date().toISOString().split('T')[0];
//       let activeCount = 0;
//       users.forEach(user => {
//         if (user.lastLoginDate.startsWith(today)) activeCount++;
//       });
//       this.activeUserData = [
//         { name: 'Active Today', value: activeCount },
//         { name: 'Inactive', value: users.length - activeCount }
//       ];
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { RecentUserService } from '../../../services/recent-user.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-analytics',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './user-analytics.component.html',
  styleUrls: ['./user-analytics.component.css']
})
export class UserAnalyticsComponent implements OnInit {
  recentUsers: any[] = [];
  userSignupData: any[] = [];
  roleDistribution: any[] = [];
  activeUserData: any[] = [];

  constructor(private recentUserService: RecentUserService) {}

  ngOnInit(): void {
    this.loadRecentUsers();
  }

loadRecentUsers(): void {
  this.recentUserService.getRecentUsers().subscribe(users => {
    console.log("✅ Users Loaded:", users);
    this.recentUsers = users;

    if (users.length === 0) {
      console.warn("⚠ No users retrieved! Check API response.");
    }

    // Check if signup trends are generated correctly
    const signupMap: { [key: string]: number } = {};
    users.forEach(user => {
      const date = user.createdAt.split('T')[0];
      signupMap[date] = (signupMap[date] || 0) + 1;
    });

    this.userSignupData = Object.keys(signupMap).map(date => ({
      name: date,
      value: signupMap[date]
    }));

    console.log("📊 Signup Data Generated:", this.userSignupData);

    // Role distribution
    const roles = { Admin: 0, User: 0 };
    users.forEach(u => {
      if (u.role === 1) roles.Admin++;
      else roles.User++;
    });

    this.roleDistribution = [
      { name: 'Admin', value: roles.Admin },
      { name: 'User', value: roles.User }
    ];

    console.log("📌 Role Distribution:", this.roleDistribution);

    // Active users today
    const today = new Date().toISOString().split('T')[0];
    let activeCount = 0;
    users.forEach(user => {
      if (user.lastLoginDate.startsWith(today)) activeCount++;
    });

    this.activeUserData = [
      { name: 'Active Today', value: activeCount },
      { name: 'Inactive', value: users.length - activeCount }
    ];

    console.log("🔥 Active User Data:", this.activeUserData);
  });
}
  // Ensure y-axis only displays multiples of 10
  yAxisTickFormatting = (value: number) => {
    return value % 10 === 0 ? value : ''; // ✅ Shows only multiples of 10
  };
}