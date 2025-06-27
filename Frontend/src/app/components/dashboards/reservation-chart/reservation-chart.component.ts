// import { Component, OnInit, ViewChild } from '@angular/core';
// import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
// import { BookingService } from '../../../services/booking.service';
// import { BaseChartDirective } from 'ng2-charts';
// import { Chart, registerables } from 'chart.js';
// import { CommonModule } from '@angular/common';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-reservation-chart',
//   standalone: true,
//   imports: [BaseChartDirective,CommonModule],
//   templateUrl: './reservation-chart.component.html',
//   styleUrls: ['./reservation-chart.component.css']
// })
// export class ReservationChartComponent implements OnInit {
//   @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

//   public barChartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' }
//     }
//   };

//   public barChartType: ChartType = 'bar';
//   public barChartData: ChartData<'bar'> = {
//     labels: [],
//     datasets: []
//   };

//   constructor(private bookingService: BookingService) {}

//   ngOnInit(): void {
//     this.loadReservationData();
//   }

//  loadReservationData(): void {
//   this.bookingService.getReservationStatusSummary().subscribe(data => {
//     const labels = data.map(flight => flight.flightNumber);
//     const confirmedCounts = data.map(flight => flight.statusCounts?.find((s: { status: number; count: number }) => s.status === 0)?.count || 0);
//     const pendingCounts = data.map(flight => flight.statusCounts?.find((s: { status: number; count: number }) => s.status === 1)?.count || 0);
//     const cancelledCounts = data.map(flight => flight.statusCounts?.find((s: { status: number; count: number }) => s.status === 2)?.count || 0);
//     const refundedCounts = data.map(flight => flight.statusCounts?.find((s: { status: number; count: number }) => s.status === 3)?.count || 0);

//     this.barChartData = {
//       labels: labels,
//       datasets: [
//         { label: "Confirmed", data: confirmedCounts, backgroundColor: "green" },
//         { label: "Pending", data: pendingCounts, backgroundColor: "yellow" },
//         { label: "Cancelled", data: cancelledCounts, backgroundColor: "red" },
//         { label: "Refunded", data: refundedCounts, backgroundColor: "blue" }
//       ]
//     };
//   });
// }
// }

// import { Component, OnInit } from '@angular/core';
// import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
// import { BookingService } from '../../../services/booking.service';
// import { BaseChartDirective } from 'ng2-charts';
// import { Chart, registerables } from 'chart.js';
// import { CommonModule } from '@angular/common';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-reservation-chart',
//   standalone: true,
//   imports: [BaseChartDirective, CommonModule],
//   templateUrl: './reservation-chart.component.html',
//   styleUrls: ['./reservation-chart.component.css'],
// })
// export class ReservationChartComponent implements OnInit {
//   public flightCharts: { flightNumber: string; chartData: ChartData<'bar'> }[] =
//     [];
//   public barChartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     maintainAspectRatio: false, // ✅ Allows better height adjustment
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { 
//         stepSize: 10, // ✅ Locks scaling to multiples of 10
//           color: '#333', // ✅ Darker text for readability
//           font: { size: 14 },
//         },
//       },
//       x: {
//         ticks: {
//           color: '#333',
//           font: { size: 14 },
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         labels: {
//           color: '#333', // ✅ Improve contrast
//           font: { size: 14 },
//         },
//       },
//     },
//   };

  
//   public barChartType: ChartType = 'bar';

//   constructor(private bookingService: BookingService) {}

//   ngOnInit(): void {
//     this.loadReservationData();
//   }

//   loadReservationData(): void {
//     this.bookingService.getReservationStatusSummary().subscribe((data) => {
//       this.flightCharts = data.map((flight) => ({
//         flightNumber: flight.flightNumber,
//         chartData: {
//           labels: ['Confirmed', 'Pending', 'Cancelled', 'Refunded'],
//           datasets: [
//             {
//               label: 'Reservations',
//               data: flight.statusCounts.map(
//                 (s: { status: number; count: number }) => s.count
//               ),
//               backgroundColor: ['#5bcc70', '#f5c401', '#d74c3d', '#3798dc'], // ✅ Vibrant modern colors
//               borderColor: ['#27ae61', '#f39c11', '#c0392c', '#2980b9'], // ✅ Border colors for clarity
//               borderWidth: 2,
//               hoverBackgroundColor: [
//                 '#58d68d',
//                 '#f7dc6f',
//                 '#ec7063',
//                 '#5dade2',
//               ], // ✅ Changes color on hover
//             },
//           ],
//         },
//       }));
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BookingService } from '../../../services/booking.service';
import { BaseChartDirective,NgChartsConfiguration} from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-reservation-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">
          <span class="title-icon">✈️</span>
          Flight Reservations Dashboard
        </h1>
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-number">{{ getTotalFlights() }}</div>
            <div class="stat-label">Active Flights</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ getTotalReservations() }}</div>
            <div class="stat-label">Total Reservations</div>
          </div>
        </div>
      </div>

      
         
          
         

      <div class="charts-grid" *ngIf="flightCharts.length > 0; else loadingState">
  <div *ngFor="let flightChart of flightCharts; let i = index; trackBy: trackByFlightNumber" class="chart-card"
       [style.animation-delay]="getAnimationDelay(i) + 'ms'">
    
    <!-- Chart Header -->
    <div class="chart-header">
      <div class="flight-info">
        <h3 class="flight-number">{{ flightChart.flightNumber }}</h3>
          <h3 class="flight-number">{{ flightChart.origin }} - {{flightChart.destination}}</h3>
        
        <!-- Flight Status Indicators -->
        <div class="flight-status-indicators">
          <div class="status-dot confirmed" [attr.data-count]="getStatusCount(flightChart, 0)"></div>
          <div class="status-dot pending" [attr.data-count]="getStatusCount(flightChart, 1)"></div>
          <div class="status-dot cancelled" [attr.data-count]="getStatusCount(flightChart, 2)"></div>
          <div class="status-dot refunded" [attr.data-count]="getStatusCount(flightChart, 3)"></div>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <canvas baseChart
              class="chart-canvas"
              [data]="flightChart.chartData"
              [options]="barChartOptions"
              [type]="barChartType">
      </canvas>
    </div>
  </div>
</div>

<!-- Loading State -->
<ng-template #loadingState>
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p class="loading-text">Loading reservation data...</p>
  </div>
</ng-template>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .dashboard-header {
      margin-bottom: 3rem;
      text-align: center;
    }

    .dashboard-title {
      color: white;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .title-icon {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    .stats-overview {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem 2rem;
      text-align: center;
      color: white;
      min-width: 150px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.25);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(45deg, #ffd700, #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .chart-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 
        0 20px 40px rgba(0,0,0,0.1),
        0 8px 32px rgba(0,0,0,0.05);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: slideInUp 0.6s ease-out both;
      position: relative;
      overflow: hidden;
    }

    .chart-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 24px 24px 0 0;
    }

    .chart-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 
        0 32px 60px rgba(0,0,0,0.15),
        0 16px 48px rgba(0,0,0,0.1);
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f2f7;
    }

    .flight-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .flight-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0;
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .flight-status-indicators {
      display: flex;
      gap: 0.5rem;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      position: relative;
      transition: all 0.3s ease;
    }

    .status-dot.confirmed { background: #27ae60; }
    .status-dot.pending { background: #f39c11; }
    .status-dot.cancelled { background: #e74c3c; }
    .status-dot.refunded { background: #3498db; }

    .status-dot:hover {
      transform: scale(1.5);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .chart-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: rgba(102, 126, 234, 0.1);
      border: none;
      border-radius: 12px;
      padding: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.2rem;
    }

    .action-btn:hover {
      background: rgba(102, 126, 234, 0.2);
      transform: scale(1.1);
    }

    .chart-wrapper {
      height: 400px;
      margin: 1.5rem 0;
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(248, 249, 252, 0.8);
      padding: 1rem;
    }

    .chart-summary {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 2px solid #f0f2f7;
    }

    .summary-stats {
      display: flex;
      justify-content: space-around;
      gap: 1rem;
    }

    .summary-item {
      text-align: center;
      padding: 0.75rem;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 12px;
      flex: 1;
      transition: all 0.3s ease;
    }

    .summary-item:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }

    .summary-label {
      display: block;
      font-size: 0.8rem;
      color: #7f8c8d;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .summary-value {
      display: block;
      font-size: 1.2rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: white;
    }

    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 1.1rem;
      opacity: 0.9;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
      }
      
      .chart-card {
        padding: 1.5rem;
      }
      
      .dashboard-title {
        font-size: 2rem;
      }
      
      .stats-overview {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class ReservationChartComponent implements OnInit {
  public flightCharts: { flightNumber: string; origin:string;destination:string;chartData: ChartData<'bar'> }[] = [];
  
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
          lineWidth: 1
        },
        ticks: {
          stepSize: 10,
          color: '#5a6c7d',
          font: { 
            size: 12, 
            weight: 500 
          },
          padding: 10
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#5a6c7d',
          font: { 
            size: 12, 
            weight: 600
          },
          padding: 10
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 12
      }
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false
      }
    }
  };

  public barChartType: ChartType = 'bar';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadReservationData();
  }

  loadReservationData(): void {
  this.bookingService.getReservationStatusSummary().subscribe((data) => {
    console.log('Raw API Response:', data); // ✅ Debugging log

    this.flightCharts = data.map((flight) => {
      const statusLabels = ['Pending', 'Confirmed', 'Cancelled', 'Refunded'];

      // ✅ Ensure all statuses exist
      const statusData = statusLabels.map((label, index) => {
        const statusEntry = flight.statusCounts.find((s: { status: number }) => s.status === index);
        return statusEntry ? statusEntry.count : 0; // ✅ Default to 0 if missing
      });

      return {
        flightNumber: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        chartData: {
          labels: statusLabels,
          datasets: [
            {
              label: 'Reservations',
              data: statusData,
              backgroundColor: [
                'rgba(243, 156, 17, 0.8)',  // Pending
                'rgba(39, 174, 96, 0.8)',   // Confirmed
                'rgba(231, 76, 60, 0.8)',   // Cancelled
                'rgba(52, 152, 219, 0.8)'   // Refunded
              ],
              borderColor: ['#f39c11', '#27ae60', '#e74c3c', '#3498db'],
              borderWidth: 2,
              hoverBackgroundColor: ['#f39c11', '#27ae60', '#e74c3c', '#3498db'],
              hoverBorderWidth: 3
            }
          ]
        }
      };
    });

    console.log('Processed Flight Charts:', this.flightCharts); // ✅ Debugging log
  });
}
  // loadReservationData(): void {

  //   this.bookingService.getReservationStatusSummary().subscribe((data) => {
  //     console.log(data);
  //     data.forEach((flight) => {
  //   console.log(`Processing flight: ${flight.flightNumber}`, flight.statusCounts); // ✅ Debugging log
  // });


  //     this.flightCharts = data.map((flight) => ({
  //       flightNumber: flight.flightNumber,
  //       origin:flight.origin,
  //       destination:flight.destination,
  //       chartData: {
  //         labels: ['Confirmed', 'Pending', 'Cancelled', 'Refunded'],
  //         datasets: [
  //           {
  //             label: 'Reservations',
  //             data: flight.statusCounts.map(
  //               (s: { status: number; count: number }) => s.count
  //             ),
  //             backgroundColor: [
  //               'rgba(39, 174, 96, 0.8)',   // Confirmed
  //               'rgba(243, 156, 17, 0.8)',  // Pending
  //               'rgba(231, 76, 60, 0.8)',   // Cancelled
  //               'rgba(52, 152, 219, 0.8)'   // Refunded
  //             ],
  //             borderColor: [
  //               '#27ae60',
  //               '#f39c11', 
  //               '#e74c3c',
  //               '#3498db'
  //             ],
  //             borderWidth: 2,
  //             hoverBackgroundColor: [
  //               '#27ae60',
  //               '#f39c11',
  //               '#e74c3c', 
  //               '#3498db'
  //             ],
  //             hoverBorderWidth: 3
  //           }
  //         ]
  //       }
  //     }));
  //   });
  // }

  trackByFlightNumber(index: number, item: any): string {
    return item.flightNumber;
  }

  getAnimationDelay(index: number): number {
    return index * 150;
  }

  getTotalFlights(): number {
    return this.flightCharts.length;
  }

  getTotalReservations(): number {
    return this.flightCharts.reduce((total, flight) => {
      return total + flight.chartData.datasets[0].data.reduce((sum: number, count) => sum + (count as number), 0);
    }, 0);
  }

  getStatusCount(flightChart: any, statusIndex: number): number {
    return flightChart.chartData.datasets[0].data[statusIndex] as number;
  }

  getFlightTotal(flightChart: any): number {
    return flightChart.chartData.datasets[0].data.reduce((sum: number, count:number) => sum + (count as number), 0);
  }

  getConfirmedRate(flightChart: any): number {
    const total = this.getFlightTotal(flightChart);
    const confirmed = this.getStatusCount(flightChart, 0);
    return total > 0 ? Math.round((confirmed / total) * 100) : 0;
  }
}






