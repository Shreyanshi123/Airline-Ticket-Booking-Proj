// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// @Component({
//   selector: 'app-dashboard',
//   imports:[CommonModule,RouterLink],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {
//   airlineForm: FormGroup;
//   airlineList:any[] = [];
//   showAddBtn:boolean = true;
 
//   constructor(private fb: FormBuilder) {
//     this.airlineForm = fb.group({
//       id: [''],
//       airlineName: ['', Validators.required],
//       airlineCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
//       contactNumber: ['', [Validators.required, Validators.pattern('[- +()0-9]{6,}')]]
//     });
//    }
 
//   ngOnInit(): void {
//     // this.getAllAirlines();
//   }
 
 

 
//   resetForm(){
//     this.airlineForm.reset();
//     for (let control in this.airlineForm.controls) {
//       this.airlineForm.controls[control].setErrors(null);
//     }
//     this.showAddBtn = true;
//   }
//   logout(){
   
//   }
 
// }



import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports:[CommonModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalReservations: number = 0;
  totalRevenue: number = 0;
  activeUsers: number = 0;
  popularRoutes: any[] = [];

  constructor(private adminAnalyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.adminAnalyticsService.getReservationsToday().subscribe(data => {
      this.totalReservations = data.total;
    });

    this.adminAnalyticsService.getRevenueToday().subscribe(data => {
      this.totalRevenue = data.amount;
    });

    this.adminAnalyticsService.getActiveUsers().subscribe(data => {
      this.activeUsers = data.count;
    });

    this.adminAnalyticsService.getPopularRoutes().subscribe(data => {
      this.popularRoutes = data.routes.slice(0, 3); // ✅ Show only Top 3 Routes
    });
  }
}
 
 
