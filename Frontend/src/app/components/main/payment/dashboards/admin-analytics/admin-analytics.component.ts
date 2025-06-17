// import { Component, OnInit } from '@angular/core';
// import { AnalyticsService } from '../../../analytics.service';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
 
// @Component({
//   selector: 'app-admin-analytics',
//   imports:[NgxChartsModule],
//   templateUrl: './admin-analytics.component.html',
//   styleUrls: ['./admin-analytics.component.css']
// })
// export class AdminAnalyticsComponent implements OnInit {
 
//   dailySalesData: any[] = [];
//   bookingTrendsData: any[] = [];
//   revenueTrendsData: any[] = [];
//   cancellationsData: any[] = [];
 
//   constructor(private analyticsService: AnalyticsService) {}
 
//   ngOnInit(): void {
//     this.loadAllData();
//   }
 
//   loadAllData(): void {
//     this.analyticsService.getDailySales().subscribe(data => {
//       this.dailySalesData = data.map(item => ({
//         name: this.formatDate(item.date),
//         value: item.totalAmount
//       }));
//     });
 
//     this.analyticsService.getBookingTrends().subscribe(data => {
//       this.bookingTrendsData = data.map(item => ({
//         name: this.formatDate(item.date),
//         value: item.bookings
//       }));
//     });
 
//     this.analyticsService.getRevenueTrends().subscribe(data => {
//       this.revenueTrendsData = data.map(item => ({
//         name: this.formatDate(item.date),
//         value: item.revenue
//       }));
//     });
 
//     this.analyticsService.getCancellations().subscribe(data => {
//       this.cancellationsData = data.map(item => ({
//         name: this.formatDate(item.date),
//         value: item.cancellations
//       }));
//     });
//   }
 
//   // Utility to nicely format date
//   formatDate(dateStr: string): string {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString();
//   }
// }


import { Component, OnInit } from '@angular/core';


import { AnalyticsService } from '../../../services/analytics.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
 
@Component({

  selector: 'app-admin-analytics',
  imports:[NgxChartsModule],

  templateUrl: './admin-analytics.component.html',

  styleUrls: ['./admin-analytics.component.css']

})

export class AdminAnalyticsComponent implements OnInit {
 
  dailySalesData: any[] = [];

  bookingTrendsData: any[] = [];

  revenueTrendsData: any[] = [];

  cancellationsData: any[] = [];
 
  constructor(private analyticsService: AnalyticsService) {}
 
  ngOnInit(): void {

    this.loadAllData();

  }
 
  loadAllData(): void {

    this.analyticsService.getDailySales().subscribe(data => {

      this.dailySalesData = data.map(item => ({

        name: this.formatDate(item.date),
        step:200,

        value: item.totalAmount

      }));

    });
 
    this.analyticsService.getBookingTrends().subscribe(data => {

      this.bookingTrendsData = [

        {

          name: 'Bookings',

          series: data.map(item => ({

            name: this.formatDate(item.date),
            step:10,
            value: item.bookings

          }))

        }

      ];

    });
 
    this.analyticsService.getRevenueTrends().subscribe(data => {

      this.revenueTrendsData = [

        {

          name: 'Revenue',

          series: data.map(item => ({

            name: this.formatDate(item.date),
            step:10,
            value: item.revenue

          }))

        }

      ];

    });
 
    this.analyticsService.getCancellations().subscribe(data => {

      this.cancellationsData = data.map(item => ({

        name: this.formatDate(item.date),
        step:10,
        value: item.cancellations

      }));

    });

  }
 
  // Format date to dd-MM-yyyy

  formatDate(dateStr: string): string {

    const date = new Date(dateStr);

    return date.toLocaleDateString('en-GB');  // output: 12/06/2025

  }

}


 