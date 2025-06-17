// // import { Component, OnInit } from '@angular/core';
// // import { AnalyticsService } from '../../../analytics.service';
// // import { NgxChartsModule } from '@swimlane/ngx-charts';
 
// // @Component({
// //   selector: 'app-admin-analytics',
// //   imports:[NgxChartsModule],
// //   templateUrl: './admin-analytics.component.html',
// //   styleUrls: ['./admin-analytics.component.css']
// // })
// // export class AdminAnalyticsComponent implements OnInit {
 
// //   dailySalesData: any[] = [];
// //   bookingTrendsData: any[] = [];
// //   revenueTrendsData: any[] = [];
// //   cancellationsData: any[] = [];
 
// //   constructor(private analyticsService: AnalyticsService) {}
 
// //   ngOnInit(): void {
// //     this.loadAllData();
// //   }
 
// //   loadAllData(): void {
// //     this.analyticsService.getDailySales().subscribe(data => {
// //       this.dailySalesData = data.map(item => ({
// //         name: this.formatDate(item.date),
// //         value: item.totalAmount
// //       }));
// //     });
 
// //     this.analyticsService.getBookingTrends().subscribe(data => {
// //       this.bookingTrendsData = data.map(item => ({
// //         name: this.formatDate(item.date),
// //         value: item.bookings
// //       }));
// //     });
 
// //     this.analyticsService.getRevenueTrends().subscribe(data => {
// //       this.revenueTrendsData = data.map(item => ({
// //         name: this.formatDate(item.date),
// //         value: item.revenue
// //       }));
// //     });
 
// //     this.analyticsService.getCancellations().subscribe(data => {
// //       this.cancellationsData = data.map(item => ({
// //         name: this.formatDate(item.date),
// //         value: item.cancellations
// //       }));
// //     });
// //   }
 
// //   // Utility to nicely format date
// //   formatDate(dateStr: string): string {
// //     const date = new Date(dateStr);
// //     return date.toLocaleDateString();
// //   }
// // }


// import { Component, OnInit } from '@angular/core';


// import { AnalyticsService } from '../../../services/analytics.service';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
 
// @Component({
//   selector: 'app-admin-analytics',
//   standalone:true,
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
//         step:200,

//         value: item.totalAmount

//       }));

//     });
 
//     this.analyticsService.getBookingTrends().subscribe(data => {

//       this.bookingTrendsData = [

//         {

//           name: 'Bookings',

//           series: data.map(item => ({

//             name: this.formatDate(item.date),
//             step:10,
//             value: item.bookings

//           }))

//         }

//       ];

//     });
 
//     this.analyticsService.getRevenueTrends().subscribe(data => {

//       this.revenueTrendsData = [

//         {

//           name: 'Revenue',

//           series: data.map(item => ({

//             name: this.formatDate(item.date),
//             step:10,
//             value: item.revenue

//           }))

//         }

//       ];

//     });
 
//     this.analyticsService.getCancellations().subscribe(data => {

//       this.cancellationsData = data.map(item => ({

//         name: this.formatDate(item.date),
//         step:10,
//         value: item.cancellations

//       }));

//     });

//   }
 
//   // Format date to dd-MM-yyyy

//   formatDate(dateStr: string): string {

//     const date = new Date(dateStr);

//     return date.toLocaleDateString('en-GB');  // output: 12/06/2025

//   }

// }


import { Component, OnInit } from '@angular/core';

import { AnalyticsService } from '../../../services/analytics.service';

import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';

import { CommonModule } from '@angular/common';
 
@Component({

  selector: 'app-admin-analytics',

  standalone: true,

  imports: [NgxChartsModule, CommonModule],

  templateUrl: './admin-analytics.component.html',

  styleUrls: ['./admin-analytics.component.css']

})

export class AdminAnalyticsComponent implements OnInit {
 
  // Chart Data

  dailySalesData: any[] = [];

  bookingTrendsData: any[] = [];

  revenueTrendsData: any[] = [];

  cancellationsData: any[] = [];
 
  // Summary Stats

  totalRevenue: number = 0;

  totalBookings: number = 0;

  cancellationRate: number = 0;

  avgDailySales: number = 0;
 
  // Chart Configurations

  view: [number, number] = [700, 300];
 
  colorScheme: Color = {

    name: 'custom',

    selectable: true,

    group: ScaleType.Ordinal,

    domain: ['#4ecdc4', '#ff6b6b', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']

  };
 
  // Chart display options

  showXAxis = true;

  showYAxis = true;

  gradient = true;

  showLegend = true;

  showXAxisLabel = true;

  showYAxisLabel = true;

  xAxisLabel = 'Date';

  yAxisLabel = 'Amount';

  timeline = true;

  doughnut = true;

  animations = true;
 
  legendPosition: LegendPosition = LegendPosition.Below;
 
  isLoading = true;
 
  constructor(private analyticsService: AnalyticsService) {}
 
  ngOnInit(): void {

    this.loadAllData();

  }
 
  loadAllData(): void {

    this.isLoading = true;
 
    // Load Daily Sales

    this.analyticsService.getDailySales().subscribe({

      next: (data) => {

        this.dailySalesData = [{

          name: 'Daily Sales',

          series: data.map(item => ({

            name: this.formatDate(item.date),

            value: item.totalAmount

          }))

        }];

        this.calculateTotalRevenue();

        this.calculateAvgDailySales();

      },

      error: (error) => console.error('Error loading daily sales:', error)

    });
 
    // Load Booking Trends

    this.analyticsService.getBookingTrends().subscribe({

      next: (data) => {

        this.bookingTrendsData = data.map(item => ({

          name: this.formatDate(item.date),

          value: item.bookings

        }));

        this.calculateTotalBookings();

      },

      error: (error) => console.error('Error loading booking trends:', error)

    });
 
    // Load Revenue Trends

    this.analyticsService.getRevenueTrends().subscribe({

      next: (data) => {

        this.revenueTrendsData = [{

          name: 'Revenue Trends',

          series: data.map(item => ({

            name: this.formatDate(item.date),

            value: item.revenue

          }))

        }];

      },

      error: (error) => console.error('Error loading revenue trends:', error)

    });
 
    // Load Cancellations

    this.analyticsService.getCancellations().subscribe({

      next: (data) => {

        this.cancellationsData = [

          {

            name: 'Confirmed',

            value: data.reduce((sum, item) => sum + (item.totalBookings - item.cancellations), 0)

          },

          {

            name: 'Cancelled',

            value: data.reduce((sum, item) => sum + item.cancellations, 0)

          }

        ];

        this.calculateCancellationRate();

      },

      error: (error) => console.error('Error loading cancellations:', error),

      complete: () => {

        this.isLoading = false;

      }

    });

  }
 
  // Calculations

  calculateTotalRevenue(): void {

    this.totalRevenue = this.dailySalesData[0]?.series?.reduce((sum: number, item: any) => sum + item.value, 0) || 0;

  }
 
  calculateTotalBookings(): void {

    this.totalBookings = this.bookingTrendsData.reduce((sum, item) => sum + item.value, 0);

  }
 
  calculateCancellationRate(): void {

    const totalCancelled = this.cancellationsData.find(item => item.name === 'Cancelled')?.value || 0;

    const totalConfirmed = this.cancellationsData.find(item => item.name === 'Confirmed')?.value || 0;

    const total = totalCancelled + totalConfirmed;

    this.cancellationRate = total > 0 ? (totalCancelled / total) * 100 : 0;

  }
 
  calculateAvgDailySales(): void {

    const seriesLength = this.dailySalesData[0]?.series?.length || 0;

    this.avgDailySales = seriesLength > 0 ? this.totalRevenue / seriesLength : 0;

  }
 
  // Formatting Utilities

  formatDate(dateStr: string): string {

    const date = new Date(dateStr);

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  }
 
  formatCurrency(value: number): string {

    return new Intl.NumberFormat('en-US', {

      style: 'currency',

      currency: 'USD',

      minimumFractionDigits: 0

    }).format(value);

  }
 
  formatPercentage(value: number): string {

    return `${value.toFixed(1)}%`;

  }
 
  // Chart Event Handlers

  onSelect(data: any): void {

    console.log('Item clicked', data);

  }
 
  onActivate(data: any): void {

    console.log('Activate', data);

  }
 
  onDeactivate(data: any): void {

    console.log('Deactivate', data);

  }
 
  // Utility: Refresh full data

  refreshData(): void {

    this.loadAllData();

  }
 
  // Responsive resize handler

  onResize(event: any): void {

    this.view = [event.target.innerWidth * 0.9, 300];

  }

}

 


 