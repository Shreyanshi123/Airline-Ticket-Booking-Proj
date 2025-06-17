import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PopularFlight {
  origin: string;
  destination: string;
  totalReservations: number;
}

@Injectable({
  providedIn: 'root'
})

export class AnalyticsService {

    //https://localhost:7035/api/Flights/GetPopularFlights/popular
    private baseUrl = 'https://your-api-url/api'; // Replace with your actual API base URL

   
  constructor(private http: HttpClient) {}

   getPopularFlights(): Observable<PopularFlight[]> {
    return this.http.get<PopularFlight[]>(`https://localhost:7035/api/Flights/GetPopularFlights/popular`);
  }



  getDailySales(): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7035/api/Analytics/admin/daily-sales`);
  }
 
  getBookingTrends(): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7035/api/Analytics/admin/booking-trends`);
  }
 
  getRevenueTrends(): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7035/api/Analytics/admin/revenue-trends`);
  }
 
  getCancellations(): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7035/api/Analytics/admin/cancellations`);
  }

  getReservationsToday(): Observable<any> {
  return this.http.get<any>(`https://localhost:7035/api/Analytics/admin/reservations-today`);
}

getRevenueToday(): Observable<any> {
  return this.http.get<any>(`https://localhost:7035/api/Analytics/admin/revenue-today`);
}

getActiveUsers(): Observable<any> {
  return this.http.get<any>(`https://localhost:7035/api/Analytics/admin/active-users`);
}

getPopularRoutes(): Observable<any> {
  return this.http.get<any>(`https://localhost:7035/api/Analytics/admin/popular-routes`);
}
}




 

 



 
 
