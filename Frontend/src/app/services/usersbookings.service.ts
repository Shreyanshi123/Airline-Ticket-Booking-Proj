import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersbookingsService {
   private apiUrl = 'https://localhost:7035/api/Users/UsersWithReservations';


  constructor(private http:HttpClient) { }
  

  getUserswithReservation():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}`)
  }
}
