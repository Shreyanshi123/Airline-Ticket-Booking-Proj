

import { Component, OnInit } from '@angular/core';


import { AnalyticsService, PopularFlight } from '../../../services/analytics.service';
import { CommonModule } from '@angular/common';
import {NgxChartsModule} from '@swimlane/ngx-charts';
 
@Component({

  selector: 'app-popular-flights',
  imports:[CommonModule,NgxChartsModule],

  templateUrl: './popular-flights.component.html',

  styleUrls: ['./popular-flights.component.css']

})

export class PopularFlightsComponent implements OnInit {
 
  popularFlights: PopularFlight[] = [];
   chartData: any[] = [];
  customColors: { name: string; value: string }[] = [];

  // ✅ Enforce multiples of 10 on the y-axis
  yAxisTickFormatting = (value: number) => {
    return value % 10 === 0 ? value : ''; // ✅ Shows only multiples of 10
  };

 
  constructor(private analyticsService: AnalyticsService) {}
 
  ngOnInit(): void {

    this.analyticsService.getPopularFlights().subscribe({

      next: (data) => {

        this.popularFlights = data;
       this.chartData = data.map(f => ({
          name: `${f.origin} - ${f.destination}`,
          value:f.totalReservations // ✅ Round to nearest 10
        }));

        this.customColors = this.chartData.map(d => ({
          name: d.name,
          value: d.value > 100 ? "#2ecc71" : "#e74c3c" // ✅ Assign colors dynamically
        }));


      },

      error: (err) => {

        console.error(err);

      }

    });

  }

}

 