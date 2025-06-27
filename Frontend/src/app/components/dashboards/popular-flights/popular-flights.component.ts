

// import { Component, OnInit } from '@angular/core';
// import { AnalyticsService, PopularFlight } from '../../../services/analytics.service';
// import { CommonModule } from '@angular/common';
// import {NgxChartsModule} from '@swimlane/ngx-charts';
 
// @Component({
//   selector: 'app-popular-flights',
//   imports:[CommonModule,NgxChartsModule],
//   standalone:true,
//   templateUrl: './popular-flights.component.html',

//   styleUrls: ['./popular-flights.component.css']

// })

// export class PopularFlightsComponent implements OnInit {
 
//   popularFlights: PopularFlight[] = [];
//    chartData: any[] = [];
//   customColors: { name: string; value: string }[] = [];

//   // ✅ Enforce multiples of 10 on the y-axis
//   yAxisTickFormatting = (value: number) => {
//     return value % 10 === 0 ? value : ''; // ✅ Shows only multiples of 10
//   };

 
//   constructor(private analyticsService: AnalyticsService) {}
 
//   ngOnInit(): void {

//     this.analyticsService.getPopularFlights().subscribe({

//       next: (data) => {

//         this.popularFlights = data;
//        this.chartData = data.map(f => ({
//           name: `${f.origin} - ${f.destination}`,
//           value:f.totalReservations // ✅ Round to nearest 10
//         }));

//         this.customColors = this.chartData.map(d => ({
//           name: d.name,
//           value: d.value > 100 ? "#2ecc71" : "#e74c3c" // ✅ Assign colors dynamically
//         }));


//       },

//       error: (err) => {

//         console.error(err);

//       }

//     });

//   }

// }

 


import { Component, OnInit } from '@angular/core';
import { AnalyticsService, PopularFlight } from '../../../services/analytics.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { colorSets } from '@swimlane/ngx-charts'; // ✅ Import predefined color schemes
import { LegendPosition } from '@swimlane/ngx-charts'; // ✅ Import LegendPosition




@Component({
  selector: 'app-popular-flights',
  imports: [CommonModule, NgxChartsModule],
  standalone: true,
  templateUrl: './popular-flights.component.html',
  styleUrls: ['./popular-flights.component.css']
})
export class PopularFlightsComponent implements OnInit {
  popularFlights: PopularFlight[] = [];
  chartData: any[] = [];
  pieChartData: any[] = [];
  animations = true;


  loading = true;
  error = false;
   totalReservations: number = 0;
  avgReservationsPerRoute: number = 0;

  // ✅ Use a predefined color scheme
  colorScheme = 'cool'; // 'cool' is a predefined scheme
  // ✅ Use the correct enum value
  legendPosition: LegendPosition = LegendPosition.Right;




  calculateStats(): void {
    this.totalReservations = this.popularFlights.reduce((sum, f) => sum + (f.totalReservations || 0), 0);
    this.avgReservationsPerRoute = this.popularFlights.length > 0 ? Math.round(this.totalReservations / this.popularFlights.length) : 0;
  }

  // Chart options
  view: [number, number] = [250, 400];
  pieView: [number, number] = [400, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Flight Routes';
  yAxisLabel = 'Total Reservations';
  showDataLabel = true;
  // animations = true;

  // Custom color scheme
  // colorScheme = {
  //   domain: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7']
  // };

  customColors: { name: string; value: string }[] = [];

  // Y-axis formatting
  yAxisTickFormatting = (value: number) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }
    return value.toString();
  };

  // Data label formatting
  dataLabelFormatting = (value: number) => {
    return value.toString();
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadPopularFlights();
  }

  loadPopularFlights(): void {
    this.loading = true;
    this.error = false;

    this.analyticsService.getPopularFlights().subscribe({
      next: (data) => {
        this.popularFlights = data;
        this.processChartData(data);
          this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  private processChartData(data: PopularFlight[]): void {
    // Bar chart data
    this.chartData = data.map(f => ({
      name: `${f.origin} → ${f.destination}`,
      value: f.totalReservations
    }));

    // Pie chart data (top 6 routes)
    this.pieChartData = data.slice(0, 6).map(f => ({
      name: `${f.origin}-${f.destination}`,
      value: f.totalReservations
    }));

    // Custom colors based on reservation count
    this.customColors = this.chartData.map(d => ({
      name: d.name,
      value: this.getColorByValue(d.value)
    }));
  }

  private getColorByValue(value: number): string {
    if (value >= 200) return '#667eea';
    if (value >= 150) return '#764ba2';
    if (value >= 100) return '#f093fb';
    if (value >= 50) return '#4facfe';
    return '#43e97b';
  }

  retryLoad(): void {
    this.loadPopularFlights();
  }

  getTrendIcon(reservations: number): string {
    if (reservations >= 150) return '📈';
    if (reservations >= 100) return '📊';
    return '📉';
  }

  getPopularityLevel(reservations: number): string {
    if (reservations >= 20) return 'Very High';
    if (reservations >= 15) return 'High';
    if (reservations >= 10) return 'Medium';
    if (reservations >= 5) return 'Low';
    return 'Very Low';
  }

  getPopularityClass(reservations: number): string {
    if (reservations >= 200) return 'very-high';
    if (reservations >= 150) return 'high';
    if (reservations >= 100) return 'medium';
    if (reservations >= 50) return 'low';
    return 'very-low';
  }
} 
