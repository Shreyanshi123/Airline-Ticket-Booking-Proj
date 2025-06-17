// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import {jwtDecode} from 'jwt-decode';
// import { tap } from 'rxjs';
// @Injectable({
//   providedIn: 'root'
// })


// export class AuthService {
  
//   // https://localhost:7035/api/Auth/login
//   private API_URL = 'https://localhost:7035/api';
//   userData:any;
//   constructor(private http: HttpClient) { }

//   signUp(user: any): Observable<any> {
//     return this.http.post(`${this.API_URL}/Auth/register`, user);
//   }

//   signIn(user: any): Observable<any> {
//     this.userData = user;
//     console.log("🚀 Sending CAPTCHA Token:", user.captchaToken); // ✅ Debug Log


//     return this.http.post(`${this.API_URL}/Auth/login`, user).pipe(
//       tap((response: any) => {
//       this.userData = response; // ✅ Assign user data
//       console.log(this.userData);
//       localStorage.setItem('userData', JSON.stringify({
//         firstName:response.user.firstName,
//         lastName:response.user.lastName,
//         token:response.token,
//          role: response.user.role 
//       })); // ✅ Store it persistently
//     })
//     );
//   }
  
//   signOut() {
//     localStorage.removeItem('token');
//   }

//   getUserName(): string {
//   const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//   console.log(userData);
//   const firstName = userData?.firstName ;
//   const lastName = userData?.lastName || '';
//   console.log(firstName);
//   return firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName;
// }



//   getUserData(){
//      if (!this.userData) {
//     this.userData = JSON.parse(localStorage.getItem('userData') || '{}'); // ✅ Retrieve from LocalStorage
//   }
//   console.log("Retrieved User Data:", this.userData);
//   return this.userData;
//   }

//   getToken(){
//     return localStorage.getItem('token');
//   }
 
//   dataFromToken(){
//     const token = this.getToken();
//     if(token){
//       var decodedToken = jwtDecode(token) as  Record<string, string>;
//          console.log("Decoded Token:", decodedToken);

//         var userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
//             console.log("Extracted User Role:", userRole);

//         return userRole;
//       }
//       else{
//         return "";
//       }
//       }

//     getCaptcha(){
//        return this.http.get(`${this.API_URL}/captcha/generate`);
//     }
//   }



import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_DATA_KEY = 'userData';
  private readonly API_URL = 'https://localhost:7035/api';
 
  // Using BehaviorSubject for better compatibility
  private authStateSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  public authState$ = this.authStateSubject.asObservable();
 
  // Alternative signal-based approach
  authStateSignal = signal<boolean>(this.isAuthenticated());
 
  // User data storage
  userData: any;
 
  constructor(private router: Router, private http: HttpClient) {
    // Initialize userData from localStorage if available
    this.userData = this.getUserDataFromStorage();
 
    // If no userData in localStorage but token exists, try to get it from token
    if (
      (!this.userData || Object.keys(this.userData).length === 0) &&
      this.getToken()
    ) {
      // You might want to make an API call to get fresh user data
      // or decode it from the token if it contains user info
      this.refreshUserDataFromToken();
    }
  }
 
  /**
   * Create HTTP headers with authorization token
   * @returns HttpHeaders
   */
  private createHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
 
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
 
    return headers;
  }
 
  /**
   * Create HTTP headers without token (for public endpoints)
   * @returns HttpHeaders
   */
  private createPublicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
 
  /**
   * Sign up user
   * @param user User registration data
   * @returns Observable<any>
   */
  signUp(user: any): Observable<any> {
    const headers = this.createPublicHeaders();
    return this.http.post(`${this.API_URL}/Auth/register`, user, { headers });
  }
 
  /**
   * Sign in user with HTTP request
   * @param user Login credentials
   * @returns Observable<any>
   */
  signIn(user: any): Observable<any> {
    this.userData = user;
    console.log("chingu got signed in ",this.userData)
    const headers = this.createPublicHeaders();
 
    return this.http.post(`${this.API_URL}/Auth/login`, user, { headers }).pipe(
      tap((response: any) => {
        this.userData = response;
        console.log("chingu signed in data",this.userData)
 
        // Store token and user data
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
        localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response));
 
        // Update auth state
        this.authStateSubject.next(true);
        this.authStateSignal.set(true);
      })
    );
  }
 
  /**
   * Sign in with token directly (for your original implementation)
   * @param token JWT token
   */
  signInWithToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.authStateSubject.next(true);
    this.authStateSignal.set(true);
  }
 
  /**
   * Sign out user and remove token
   */
  signOut(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    this.userData = null;
    this.authStateSubject.next(false);
    this.authStateSignal.set(false);
  }
 
  /**
   * Get token from local storage
   * @returns string | null
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
 
  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
 
  /**
   * Get current auth state
   * @returns boolean
   */
  getCurrentAuthState(): boolean {
    return this.authStateSubject.value;
  }
 
  /**
   * Refresh auth state (useful for checking token validity)
   */
  refreshAuthState(): void {
    const isAuth = this.isAuthenticated();
    this.authStateSubject.next(isAuth);
    this.authStateSignal.set(isAuth);
  }
 
  /**
   * Get user data from memory or localStorage
   * @returns any
   */
  /**
   * Get user data from memory or localStorage
   * @returns any
   */
  getUserData(): any {
  if (!this.userData || Object.keys(this.userData).length === 0) {
    this.userData = this.getUserDataFromStorage();
  }
 
  // Normalize structure if needed
  if (this.userData && !this.userData.user) {
    this.userData = { user: this.userData };
  }
 
  return this.userData;
}
 
 
  /**
   * Get user name
   * @returns string
   */
  getUserName(): string {
    const userData = this.getUserData();
 
    if (!userData?.user) {
      return 'Guest'; // Default fallback for missing user
    }
 
    const firstName = userData.user.firstName ?? '';
    const lastName = userData.user.lastName ?? '';
 
    return `${firstName} ${lastName}`.trim(); // Ensure proper spacing
  }
 
  /**
   * Change password with authorization headers
   * @param data Password change data
   * @returns Observable<any>
   */
  changePassword(data: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put(
      `${this.API_URL}/UserManagement/ChangeMyPassword/change-password`,
      data,
      { headers }
    );
  }
 
  /**
   * Update user profile with authorization headers
   * @param data Profile update data
   * @returns Observable<any>
   */
  updateUserProfile(data: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http
      .put(`${this.API_URL}/UserManagement/UpdateMyProfile`, data, { headers })
      .pipe(
        tap((response: any) => {
          // Update userData in memory and localStorage
          this.userData = response;
          localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response));
        })
      );
  }
 
  /**
   * Delete user account with authorization headers
   * @returns Observable<any>
   */
  deleteAccount(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${this.API_URL}/UserManagement/DeleteUser/${id}`, {
      headers,
    });
  }
 
  /**
   * Get user data from localStorage
   * @returns any
   */
  private getUserDataFromStorage(): any {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : {};
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return {};
    }
  }
 
  /**
   * Decode token and extract user role
   * @returns string
   */
 dataFromToken(): string {
  const token = this.getToken();
  if (!token) return '';

  try {
    const decodedToken = jwtDecode(token) as Record<string, any>;
    console.log("Decoded Token:", decodedToken); // ✅ Debugging log

    // Check different possible role claim formats
    return (
      decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decodedToken['role'] || // Some APIs use 'role' directly
      decodedToken['userRole'] || // Alternative naming
      ''
    );
  } catch (error) {
    console.error("Error decoding token:", error);
    return '';
  }
}
 
  /**
   * Get user role from token
   * @returns string
   */
  getUserRole(): string {
     const role = this.dataFromToken();
  console.log("User Role:", role); // ✅ Debugging log
  return role;

  }
 
  /**
   * Get captcha from API (public endpoint)
   * @returns Observable<any>
   */
  getCaptcha(): Observable<any> {
    const headers = this.createPublicHeaders();
    return this.http.get(`${this.API_URL}/captcha/generate`, { headers });
  }
 
  /**
   * Check if token is expired
   * @returns boolean
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
 
    try {
      const decodedToken = jwtDecode(token) as { exp: number };
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
 
  /**
   * Auto logout if token is expired
   */
  checkTokenAndLogout(): void {
    if (this.isAuthenticated() && this.isTokenExpired()) {
      this.signOut();
      // Optionally redirect to login page
      // this.router.navigate(['/login'])
    }
  }
 
  /**
   * Generic method to make authenticated API calls
   * @param method HTTP method
   * @param endpoint API endpoint
   * @param data Request body (optional)
   * @returns Observable<any>
   */
  makeAuthenticatedRequest(
    method: string,
    endpoint: string,
    data?: any
  ): Observable<any> {
    const headers = this.createHeaders();
    const url = `${this.API_URL}${endpoint}`;
 
    switch (method.toUpperCase()) {
      case 'GET':
        return this.http.get(url, { headers });
      case 'POST':
        return this.http.post(url, data, { headers });
      case 'PUT':
        return this.http.put(url, data, { headers });
      case 'DELETE':
        return this.http.delete(url, { headers });
      case 'PATCH':
        return this.http.patch(url, data, { headers });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
 
  /**
   * Refresh user data from token or API call
   */
  private refreshUserDataFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as any;
        // If your token contains user data, extract it
        // Otherwise, you might need to make an API call to get user profile
 
        // Option 1: If token contains user data
        // this.userData = {
        //   user: {
        //     firstName: decodedToken.firstName,
        //     lastName: decodedToken.lastName,
        //     email: decodedToken.email,
        //     // ... other fields
        //   }
        // }
 
        // Option 2: Make API call to get user profile (recommended)
        this.getUserProfile().subscribe({
          next: (userData) => {
            this.userData = userData;
            localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
          },
          error: (error) => {
            console.error('Error fetching user profile:', error);
          },
        });
      } catch (error) {
        console.error('Error refreshing user data from token:', error);
      }
    }
  }
 
  /**
   * Get user profile from API
   * @returns Observable<any>
   */
  getUserProfile(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.API_URL}/UserManagement/GetMyProfile`, {
      headers,
    });
  }
}