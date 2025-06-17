import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable ,throwError} from 'rxjs';
import { tap,catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
//https://localhost:7035/api/Flights/GetAllFlights




export class FlightsService{
  private baseUrl = 'https://localhost:7035/api/Flights';
  constructor(private http:HttpClient) { }


  //https://localhost:7035/api/Flights/UpdateFlightTimes/99/update-times
  rescheduleFlight(flightId: string, rescheduleData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateFlightTimes/${flightId}/update-times`, rescheduleData);
  }
  searchFlight(from: string, to: string, departureDate: string): Observable<any> {
    // Ensure the date format matches backend expectations
    // const formattedDate = departureDate.split("T")[0];

    const params = new HttpParams()
      .set('origin', from)
      .set('destination', to)
      .set('departureDate', departureDate);

    console.log("Requesting flights from:", `${this.baseUrl}`);
    console.log("Params:", params.toString());
    const requestUrl = `${this.baseUrl}/SearchFlights/search/?${params.toString()}`;


    return this.http.get(requestUrl).pipe(
      tap(response => {
        console.log("API Response in FlightService:", response);
      }),
      catchError(error => {
        console.error("API Call Failed:", error);
        return throwError(error);
      })
    );
  }

  getFlights():Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/GetAllFlights`);
  }

  deleteFlights(flightNumber:any){
     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log(flightNumber);
    return this.http.delete(`${this.baseUrl}/DeleteFlight/${flightNumber}`,{headers});
  }
  
  getFlightByFlightNumber(flightNumber:any){
    console.log(flightNumber);
    return this.http.get(`${this.baseUrl}/GetFlight/${flightNumber}`);
  }

  updateFlight(FlightNumber:string,FlightData:any){
    FlightData= JSON.stringify(FlightData);
    console.log(FlightData);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.baseUrl}/UpdateFlight/${FlightNumber}`,FlightData,{headers,responseType:'text'});
  }

  addFlights(FlightData:any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log(FlightData);
    return this.http.post(`${this.baseUrl}/CreateFlight`,FlightData,{headers});
  }

}
