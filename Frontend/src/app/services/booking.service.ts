// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { HttpClient,HttpHeaders } from '@angular/common/http';
// import { FlightDTO } from '../models/flight.dto';
// @Injectable({
//   providedIn: 'root'
// })
// export class BookingService {
//   //https://localhost:7035/api/Reservations/CreateReservation?userId=4
//   private API_URL = 'https://localhost:7035/api/Reservations';
//   constructor(private http: HttpClient) { }


//    getRecommendations(userId: number): Observable<FlightDTO[]> {
//     return this.http.get<FlightDTO[]>(`/api/flights/recommendations/${userId}`);
//   }

//   getBookingInformation(flightId:number){
//      const token = localStorage.getItem("token");
//      const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//     return this.http.get(`${this.API_URL}/GetReservation/${flightId}`,{headers});
//   }

//   //https://localhost:7035/api/Reservations/GetReservationStatusSummary/reservation-status-summary
//   getReservationStatusSummary(airline?:string): Observable<any[]> {
//   const token = localStorage.getItem("token");
//   const headers = new HttpHeaders({
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   });

//    let url = `${this.API_URL}/GetReservationStatusSummary/reservation-status-summary`;
//   if (airline) {
//     url += `?airline=${encodeURIComponent(airline)}`;
//   }

//   return this.http.get<any[]>(url, { headers });
// }


//   // return this.http.get<any[]>(`${this.API_URL}/GetReservationStatusSummary/reservation-status-summary`, { headers });
// getFlightsByAirline(airline: string): Observable<any[]> {
//   return this.getReservationStatusSummary(airline);
// }


//   bookTickets(flightNumber:number,data:any[]){
//     const token = localStorage.getItem("token");
//      if (!token) {
//     console.error("No authentication token found! Blocking API call.");
//     return; // ✅ Prevent unauthorized API calls
//   }

//      const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });

//     console.log(headers);
//     const payload = {
//       flightId:flightNumber,
//       passengers: data.map(traveller=>({
//         seatClass : traveller.seatClass,
//          firstName :traveller.firstName,
//          lastName: traveller.lastName,
//          gender:traveller.gender,
//          age:traveller.age
//       }))
//     };
//     console.log(payload);
//     return this.http.post(`${this.API_URL}/CreateReservation`,payload,{headers});
//   }

//   sendEmail(emailData: any): Observable<any> {
//     const headers ={'Content-Type':'application/json'};
//   return this.http.post(`https://localhost:7035/api/email/send`, emailData,{headers});
// }

//   cancelRoundTrip(reservationId: number, returnReservationId?: number): Observable<any> {
//   const token = localStorage.getItem("token");
//   const headers = new HttpHeaders()
//     .set('Authorization', `Bearer ${token}`)
//     .set('Content-Type', 'application/json');

//   const url = returnReservationId 
//     ? `${this.API_URL}/CancelRoundTrip/${reservationId}/${returnReservationId}` 
//     : `${this.API_URL}/CancelRoundTrip/${reservationId}`;

//   return this.http.delete(url, { headers });
// }



//     getUserBookings(){
//     const token = localStorage.getItem("token");
//      const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//     return this.http.get(`${this.API_URL}/GetUserReservations`,{headers})
//   }

//   updatePassenger(updatedPassenger: any): Observable<any> {
//   const token = localStorage.getItem("token");
//   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
  
//   return this.http.put(`${this.API_URL}/UpdatePassenger/passengers/${updatedPassenger.id+1}`, updatedPassenger, { headers });
// }


//     getUpcomingJourneys(): Observable<any[]> {
//        const token = localStorage.getItem("token");
//      const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//     return this.http.get<any[]>(`${this.API_URL}/GetUpcomingJourneys/upcoming`, { headers});
//   }

//   getPastJourneys(): Observable<any[]> {
//      const token = localStorage.getItem("token");
//      const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//     return this.http.get<any[]>(`${this.API_URL}/GetPastJourneys/past?limit=10`, { headers});
//   }

//  checkExpiredReservations(): Observable<any> {
//   const token = localStorage.getItem("token");
//   const headers = new HttpHeaders({
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   });

//   return this.http.put(`${this.API_URL}/CleanupExpiredReservations/CleanupExpired`,{ headers });
// }

// cancelReservation(reservationId: number): Observable<any> {
//   const token = localStorage.getItem("token");
//   const headers = new HttpHeaders({
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   });
//   console.log(reservationId);
//   return this.http.delete(`${this.API_URL}/CancelReservation/${reservationId}`,{ headers });
// }


// }


import { Injectable } from '@angular/core';
import { Observable ,throwError} from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FlightDTO } from '../models/flight.dto';
import {map,catchError} from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  //https://localhost:7035/api/Reservations/CreateReservation?userId=4
  private API_URL = 'https://localhost:7035/api/Reservations';
  constructor(private http: HttpClient) { }
 

 
  bookTickets(flightNumber:number,data:any[]){
    const token = localStorage.getItem("token");
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
 
    console.log(headers);
    const payload = {
      flightId:flightNumber,
      passengers: data.map(traveller=>({
        seatClass : traveller.seatClass,
         firstName :traveller.firstName,
         lastName: traveller.lastName,
         gender:traveller.gender,
         age:traveller.age
      }))
    };
    console.log(payload);
    return this.http.post(`${this.API_URL}/CreateReservation`,payload,{headers});
  }
 
 
    getUserBookings(){
    const token = localStorage.getItem("token");
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.API_URL}/GetUserReservations`,{headers})
  }
 
    getUpcomingJourneys(): Observable<any[]> {
       const token = localStorage.getItem("token");
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(`${this.API_URL}/GetUpcomingJourneys/upcoming`, { headers});
  }
 
  getPastJourneys(): Observable<any[]> {
     const token = localStorage.getItem("token");
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(`${this.API_URL}/GetPastJourneys/past?limit=10`, { headers});
  }
 
 checkExpiredReservations(): Observable<any> {
  const token = localStorage.getItem("token");
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
 
  return this.http.put(`${this.API_URL}/CleanupExpiredReservations/CleanupExpired`,{ headers });
}
 
 sendEmail(emailData: any): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`https://localhost:7035/api/email/send`, emailData, {
      headers: headers,
      responseType: 'text', // ✅ Expect plain text response
    }).pipe(
      catchError(error => {
        console.error("❌ Error sending email:", error);
        return throwError(() => new Error("Failed to send email. Please try again."));
      })
    );
  }

 
cancelReservation(reservationId: number): Observable<any> {
  const token = localStorage.getItem("token");
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  console.log(reservationId);
  return this.http.delete(`${this.API_URL}/CancelReservation/${reservationId}`,{ headers });
}
 
updatePassenger(reservationId:any,passenger: any): Observable<any> {
  const token = localStorage.getItem("token");
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
console.log(passenger);
const payload = {
    id: passenger.id,
    firstName: passenger.firstName,
    lastName: passenger.lastName,
    age: passenger.age,
    gender: passenger.gender,
    seatClass: passenger.seatClass,
    reservationId: reservationId
  };
 
 
  return this.http.put(`${this.API_URL}/UpdatePassenger/update-passenger/${reservationId}`, payload);
}
 
 
   getRecommendations(userId: number): Observable<FlightDTO[]> {
    return this.http.get<FlightDTO[]>(`/api/flights/recommendations/${userId}`);
  }

  getBookingInformation(flightId:number){
     const token = localStorage.getItem("token");
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.API_URL}/GetReservation/${flightId}`,{headers});
  }

  //https://localhost:7035/api/Reservations/GetReservationStatusSummary/reservation-status-summary
  getReservationStatusSummary(airline?:string): Observable<any[]> {
  const token = localStorage.getItem("token");
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

   let url = `${this.API_URL}/GetReservationStatusSummary/reservation-status-summary`;
  if (airline) {
    url += `?airline=${encodeURIComponent(airline)}`;
  }

  return this.http.get<any[]>(url, { headers });
}

}
 