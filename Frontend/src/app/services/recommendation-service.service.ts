import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecommendationServiceService {

   private apiUrl = 'http://localhost:7035/api/recommendations';

  constructor(private http: HttpClient) {}

  getRecommendations(userId: number) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

}
