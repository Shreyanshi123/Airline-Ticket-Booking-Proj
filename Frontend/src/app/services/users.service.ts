import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

 private apiUrl = 'https://localhost:7035/api/UserManagement'; // Update based on actual API

  constructor(private http: HttpClient) {}

// https://localhost:7035/api/UserManagement/GetUsers?Role=0 getting all users

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetUsers?Role=0`);
  }


  getUserProfile(): Observable<any> {
     const token = localStorage.getItem("token");
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

  console.log("Headers being sent:", headers); // Debugging check

   
    return this.http.get(`${this.apiUrl}/GetMyProfile`,{headers});
  }

  updateUserProfile(updatedUser: any): Observable<any> {
     const token = localStorage.getItem("token");
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.apiUrl}/UpdateMyProfile`, updatedUser,{headers});
  }


  // https://localhost:7035/api/UserManagement/ChangeMyPassword/change-password
  changeUserPassword(newPassword: string): Observable<any> {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return new Observable(observer => {
      observer.error("User not authenticated");
    });
  }

   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

  console.log("Headers being sent:", headers); // Debugging check

  const body = { newPassword };

  return this.http.post(`${this.apiUrl}/ChangeMyPassword/change-password`, body, { headers });
}

deleteUser(userId: number): Observable<any> {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return new Observable(observer => {
      observer.error("User not authenticated");
    });
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

  console.log("Sending delete request for user ID:", userId);

  return this.http.delete(`${this.apiUrl}/DeleteUser/${userId}`, { headers });
}

}
