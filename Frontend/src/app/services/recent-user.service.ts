

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class RecentUserService {

 
  constructor(private http: HttpClient) {}
 

  //https://localhost:7035/api/UserManagement/GetRecentUsers/recent?count=10
  getRecentUsers(): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7035/api/UserManagement/GetRecentUsers/recent`);
  }
}