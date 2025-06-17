import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

private API_URL = 'https://localhost:7035/api/Payments';
  constructor(private http: HttpClient) { }

  paymentForTickets(reservationId:number,data:any){
     const token = localStorage.getItem("token");
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
     console.log(headers);
    const payload = {
      reservationId:reservationId,
      paymentMethod:data.paymentMethod,
      cardNumber:data.cardNumber,
      cardHolderName:data.cardHolderName,
      expiryMonth:data.expiryMonth,
      cvv:data.cvv
    };

     console.log(payload);
    return this.http.post(`${this.API_URL}/ProcessPayment/process`,payload,{headers});
  }
}
