

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

 
  constructor(private http: HttpClient) {}
 
  //https://localhost:7035/api/Flights/GetRecommendations/recommendations/2
  
  

  getUserRecommendations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7035/api/Flights/GetRecommendations/recommendations/${userId}`);
  }
}