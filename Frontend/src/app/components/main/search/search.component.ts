// flight-search.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FlightsService } from '../../../services/flights.service';
import Swal from 'sweetalert2';

export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDateTime: string;
  arrivalDateTime: string;
  economyPrice: number;
  businessPrice: number;
  status: string;
}

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './search.component.html', // Fixed template URL
  styleUrls: ['./search.component.css'] // Fixed style URL
})
export class SearchComponent implements OnInit { // Fixed class name
  selectedClass: string = 'Economy';
  flights: Flight[] = [];
  
  // Fixed injection - use ActivatedRoute instead of RouterModule
  private route = inject(ActivatedRoute);
  private flightService = inject(FlightsService);

  ngOnInit(): void {
     window.scrollTo(0, 0); // Scrolls to the top of the page
    // Subscribe to query parameters
    this.route.queryParams.subscribe((params: any) => {
      const from = params['origin']?.toString();
      const to = params['destination']?.toString();
      const date = params['DepartureDate']?.toString();
      
      console.log("Extracted Params:", { from, to, date });
      
      if (from && to && date) {
        this.flightService.searchFlight(from, to, date).subscribe({
          next: (result: any) => {
            this.flights = result;
            console.log("Flights Found:", this.flights);
          },
          error: (err: any) => {
            console.error("Error fetching flights:", err);
            this.flights = []; // Clear flights array on error
          }
        });
      }
    });
  }

  toggleClass(className: string): void {
    this.selectedClass = className;
  }

  getAirportCode(city: string): string {
    const codes: { [key: string]: string } = {
      'Delhi': 'DEL',
      'Mumbai': 'BOM',
      'Bangalore': 'BLR',
      'Chennai': 'MAA',
      'Kolkata': 'CCU'
    };
    return codes[city] || city.substring(0, 3).toUpperCase();
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  formatDate(dateTime: string): string {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  calculateDuration(departure: string, arrival: string): string {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr.getTime() - dep.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'on time': return 'status-on-time';
      case 'delayed': return 'status-delayed';
      case 'boarding': return 'status-boarding';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-default';
    }
  }

  BookFlight(flightId: number): void {
  console.log(`Booking flight ${flightId} in ${this.selectedClass} class`);
  
  Swal.fire({
    title: "Flight Booking",
    text: `Booking flight ${flightId} in ${this.selectedClass} class`,
    icon: "success",
    confirmButtonText: "OK"
  });
}

  getCurrentPrice(flight: Flight): number {
    return this.selectedClass === 'Economy' ? flight.economyPrice : flight.businessPrice;
  }

  // Fixed trackBy function
  trackByFlightId(index: number, flight: Flight): number {
    return flight.id;
  }
}