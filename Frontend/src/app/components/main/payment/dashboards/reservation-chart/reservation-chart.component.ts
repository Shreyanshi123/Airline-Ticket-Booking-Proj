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

import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BookingService } from '../../../services/booking.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-reservation-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './reservation-chart.component.html',
  styleUrls: ['./reservation-chart.component.css'],
})
export class ReservationChartComponent implements OnInit {
  public flightCharts: { flightNumber: string; chartData: ChartData<'bar'> }[] =
    [];
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // ✅ Allows better height adjustment
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
        stepSize: 10, // ✅ Locks scaling to multiples of 10
          color: '#333', // ✅ Darker text for readability
          font: { size: 14 },
        },
      },
      x: {
        ticks: {
          color: '#333',
          font: { size: 14 },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#333', // ✅ Improve contrast
          font: { size: 14 },
        },
      },
    },
  };

  
  public barChartType: ChartType = 'bar';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadReservationData();
  }

  loadReservationData(): void {
    this.bookingService.getReservationStatusSummary().subscribe((data) => {
      this.flightCharts = data.map((flight) => ({
        flightNumber: flight.flightNumber,
        chartData: {
          labels: ['Confirmed', 'Pending', 'Cancelled', 'Refunded'],
          datasets: [
            {
              label: 'Reservations',
              data: flight.statusCounts.map(
                (s: { status: number; count: number }) => s.count
              ),
              backgroundColor: ['#5bcc70', '#f5c401', '#d74c3d', '#3798dc'], // ✅ Vibrant modern colors
              borderColor: ['#27ae61', '#f39c11', '#c0392c', '#2980b9'], // ✅ Border colors for clarity
              borderWidth: 2,
              hoverBackgroundColor: [
                '#58d68d',
                '#f7dc6f',
                '#ec7063',
                '#5dade2',
              ], // ✅ Changes color on hover
            },
          ],
        },
      }));
    });
  }
}
