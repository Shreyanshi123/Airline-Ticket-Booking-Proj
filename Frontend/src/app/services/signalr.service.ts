import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
 
  // startConnection(): Promise<void> {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('https://localhost:7035/notificationHub',{
  //       withCredentials:true
  //     })
  //     .configureLogging(signalR.LogLevel.Information)
  //     .build();

  //   return this.hubConnection.start().catch(err => console.error('Error starting SignalR:', err));
  // }

  // listenForNotifications(callback: (message: string) => void): void {
  //   this.hubConnection.on('ReceiveNotification', callback);
  // }

   startConnection(): Promise<void> {
  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7035/notificationHub', {
       withCredentials: true,
      accessTokenFactory: () => localStorage.getItem("token") ||""
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return this.hubConnection.start().catch(err => console.error('Error starting SignalR:', err));
}

listenForNotifications(callback: (message: string) => void): void {
  this.hubConnection.on('ReceiveNotification', callback);
}


}


 


