// import { Component,inject, type OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { BookingService } from '../../../services/booking.service';
// import { TicketComponent } from '../ticket/ticket.component';
// import { CommonModule } from '@angular/common';
// import { trigger, style, animate, transition } from '@angular/animations';
// import { jwtDecode } from 'jwt-decode';
// import { AuthService } from '../../../services/auth.service';


// interface Particle {
//   x: number;
//   y: number;
//   delay: number;
//   duration: number;
// }

// @Component({
//   selector: 'app-payment-success',
//   standalone: true,
//   imports: [TicketComponent, CommonModule],
//   templateUrl: './payment-success.component.html',
//   styleUrls: ['./payment-success.component.css'],
//   animations: [
//     trigger('fadeInDown', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(-30px)' }),
//         animate(
//           '600ms ease-out',
//           style({ opacity: 1, transform: 'translateY(0)' })
//         ),
//       ]),
//     ]),
//     trigger('fadeInUp', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(30px)' }),
//         animate(
//           '600ms ease-out',
//           style({ opacity: 1, transform: 'translateY(0)' })
//         ),
//       ]),
//     ]),
//     trigger('fadeIn', [
//       transition(':enter', [
//         style({ opacity: 0 }),
//         animate('600ms ease-out', style({ opacity: 1 })),
//       ]),
//     ]),
//   ],
// })
// export class PaymentSuccessComponent implements OnInit {
//   reservationId = '';
//   bookingInfo: any;
//   flightInfo: any;
//   userEmail:any;
//   particles: Particle[] = [];
//   authService = inject(AuthService);

//   constructor(
//     private route: ActivatedRoute,
//     private bookingService: BookingService
//   ) {
//     // Generate background particles
//     this.generateParticles();
//   }

//   ngOnInit(): void {
//      const storedUserData = this.authService.getUserData();
//       const token = storedUserData?.token;
//       // let userEmail = '';
  
//       if (token) {
//         try {
//           const decodedToken: any = jwtDecode(token);
//           this.userEmail = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
//           console.log("✅ Extracted User Email from Token:", this.userEmail);
//         } catch (error) {
//           console.error("❌ Error decoding JWT token:", error);
//         }
//       } else {
//         console.error("❌ No token found in user data!");
//       }
//     // Scroll to top when component loads
//     window.scrollTo(0, 0);

//     // Extract reservation ID from route
//     this.route.params.subscribe((params) => {
//       this.reservationId = params['reservationId'] as string;
//       console.log('Extracted Reservation ID:', this.reservationId);
//       // Fetch booking information
//       this.loadBookingInfo();
//     });
//   }

//   /**
//    * Load booking information from the service
//    */
//   private loadBookingInfo(): void {
//     // Convert string to number since the service expects a number
//     const bookingId = Number(this.reservationId);

//     // Check if conversion was successful
//     if (isNaN(bookingId)) {
//       console.error('Invalid reservation ID:', this.reservationId);
//       this.showErrorMessage('Invalid reservation ID');
//       return;
//     }

//     this.bookingService.getBookingInformation(bookingId).subscribe({
//       next: (data: any) => {
//         console.log('Booking data received:', data);
//         this.bookingInfo = data;
//         this.flightInfo = data.flight;
//         console.log('Booking Info:', this.bookingInfo);
//       },
//       error: (err) => {
//         console.error('Error fetching booking info:', err);
//         this.showErrorMessage('Failed to load booking information');
//       },
//     });
//   }

//   /**
//    * Generate background particles for animation
//    */
//   private generateParticles(): void {
//     this.particles = Array.from({ length: 20 }, () => ({
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       delay: Math.random() * 5,
//       duration: 10 + Math.random() * 10,
//     }));
//   }

//   /**
//    * Print the ticket
//    */
//   printTicket(): void {
//     window.print();
//   }

//   /**
//    * Email the ticket to the user
//    */
//   emailTicket(): void {
//     // This would typically connect to a backend service
//     // For now, we'll just show a success message
//     alert('Ticket has been sent to your email address!');
//     const emailData = {
//       to: this.userEmail,
//       subject: "Booking Confirmation & E-Ticket",
//       body: `Dear ${this.username},<br><br>
//              Your flight booking is confirmed! Your ticket is attached below.<br><br>
//              <b>Booking Reference:</b> ${this.bookingInfo.bookingReference ?? 'N/A'}<br>
//              <b>Flight Details:</b><br>
//              Flight Number: ${this.bookingInfo.flight?.flightNumber ?? 'N/A'}<br>
//              Departure: ${this.bookingInfo.flight?.departureDateTime ?? 'N/A'}<br>
//              Arrival: ${this.bookingInfo.flight?.arrivalDateTime ?? 'N/A'}<br><br>
//              ${this.returnReservationId ? `<b>Return Flight:</b><br>
//              Flight Number: ${this.returnFlightInfo?.flightNumber ?? 'N/A'}<br>
//              Departure: ${this.returnFlightInfo?.departureDateTime ?? 'N/A'}<br>
//              Arrival: ${this.returnFlightInfo?.arrivalDateTime ?? 'N/A'}<br><br>` : ""}
//              Please find your e-ticket attached below.<br>`,
//       attachmentBase64: this.ticketData // ✅ Attach the ticket
//     };
//     this.bookingService.sendEmail(JSON.stringify(emailData)).subscribe({
//       next: () => console.log("✅ Email with ticket sent successfully!"),
//       error: (err) => console.error("❌ Error sending email:", err)
//     });
//   }


//   /**
//    * Download the ticket as PDF
//    */
//   downloadTicket(): void {
//     // This would typically generate a PDF
//     // For now, we'll just show a success message
//     alert('Ticket PDF download started!');
//     this.emailTicket();
//   }

//   /**
//    * Get current formatted date
//    */
//   getCurrentDate(): string {
//     return new Date().toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   }

//   /**
//    * Show error message
//    */
//   private showErrorMessage(message: string): void {
//     // Implement toast notification or modal
//     console.error('Error:', message);
//     alert(message); // Temporary - replace with proper notification
//   }
// }

// import { Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { BookingService } from '../../../services/booking.service';
// import { TicketComponent } from '../ticket/ticket.component';
// import { CommonModule } from '@angular/common';
// import { trigger, style, animate, transition } from '@angular/animations';
// import { jwtDecode } from 'jwt-decode';
// import { AuthService } from '../../../services/auth.service';

// interface Particle {
//   x: number;
//   y: number;
//   delay: number;
//   duration: number;
// }

// @Component({
//   selector: 'app-payment-success',
//   standalone: true,
//   imports: [TicketComponent, CommonModule],
//   templateUrl: './payment-success.component.html',
//   styleUrls: ['./payment-success.component.css'],
//   animations: [
//     trigger('fadeInDown', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(-30px)' }),
//         animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
//       ]),
//     ]),
//     trigger('fadeInUp', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(30px)' }),
//         animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
//       ]),
//     ]),
//     trigger('fadeIn', [
//       transition(':enter', [
//         style({ opacity: 0 }),
//         animate('600ms ease-out', style({ opacity: 1 })),
//       ]),
//     ]),
//   ],
// })
// export class PaymentSuccessComponent implements OnInit {
//   reservationId = '';
//   bookingInfo: any;
//   flightInfo: any;
//   userEmail: string = '';
//   username: string = ''; // Added username variable
//   particles: Particle[] = [];
//   authService = inject(AuthService);

//   constructor(private route: ActivatedRoute, private bookingService: BookingService) {
//     this.generateParticles();
//   }

//   ngOnInit(): void {
//     const storedUserData = this.authService.getUserData();
//     const token = storedUserData?.token;

//     if (token) {
//       try {
//         const decodedToken: any = jwtDecode(token);
//         this.userEmail = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '';
//         this.username = decodedToken["name"] || 'User'; // Extract username if available
//         console.log("✅ Extracted User Email:", this.userEmail);
//       } catch (error) {
//         console.error("❌ Error decoding JWT token:", error);
//       }
//     } else {
//       console.error("❌ No token found in user data!");
//     }

//     window.scrollTo(0, 0);

//     this.route.params.subscribe((params) => {
//       this.reservationId = params['reservationId'] as string;
//       console.log('Extracted Reservation ID:', this.reservationId);
//       this.loadBookingInfo();
//     });
//   }

//   private loadBookingInfo(): void {
//     const bookingId = Number(this.reservationId);

//     if (isNaN(bookingId)) {
//       console.error('Invalid reservation ID:', this.reservationId);
//       this.showErrorMessage('Invalid reservation ID');
//       return;
//     }

//     this.bookingService.getBookingInformation(bookingId).subscribe({
//       next: (data: any) => {
//         console.log('Booking data received:', data);
//         this.bookingInfo = data;
//         this.flightInfo = data.flight;
//       },
//       error: (err) => {
//         console.error('Error fetching booking info:', err);
//         this.showErrorMessage('Failed to load booking information');
//       },
//     });
//   }

//   private generateParticles(): void {
//     this.particles = Array.from({ length: 20 }, () => ({
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       delay: Math.random() * 5,
//       duration: 10 + Math.random() * 10,
//     }));
//   }

//   printTicket(): void {
//     window.print();
//   }

//   emailTicket(): void {
//     if (!this.userEmail) {
//       this.showErrorMessage("User email not found!");
//       return;
//     }

//     const emailData = {
//       to: this.userEmail,
//       subject: "Booking Confirmation & E-Ticket",
//       body: `
//         Dear ${this.username},<br><br>
//         Your flight booking is confirmed! Your ticket is attached below.<br><br>
//         <b>Booking Reference:</b> ${this.bookingInfo?.bookingReference ?? 'N/A'}<br>
//         <b>Flight Details:</b><br>
//         Flight Number: ${this.bookingInfo?.flight?.flightNumber ?? 'N/A'}<br>
//         Departure: ${this.bookingInfo?.flight?.departureDateTime ?? 'N/A'}<br>
//         Arrival: ${this.bookingInfo?.flight?.arrivalDateTime ?? 'N/A'}<br><br>
//         Please find your e-ticket attached below.<br>`,
//       attachmentBase64: this.bookingInfo?.ticketData ?? '', // Ensure ticket data is available
//     };

//     this.bookingService.sendEmail(JSON.stringify(emailData)).subscribe({
//       next: () => console.log("✅ Email with ticket sent successfully!"),
//       error: (err) => console.error("❌ Error sending email:", err),
//     });

//     alert('Ticket has been sent to your email address!');
//   }

//   downloadTicket(): void {
//     alert('Ticket PDF download started!');
//     this.emailTicket();
//   }

//   getCurrentDate(): string {
//     return new Date().toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   }

//   private showErrorMessage(message: string): void {
//     console.error('Error:', message);
//     alert(message);
//   }
// }

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { TicketComponent } from '../ticket/ticket.component';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { jwtDecode } from 'jwt-decode';
import html2canvas from "html2canvas"
import { AuthService } from '../../../services/auth.service';

interface Particle {
  x: number;
  y: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [TicketComponent, CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
  animations: [
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PaymentSuccessComponent implements OnInit {
  reservationId = '';
  bookingInfo: any;
  flightInfo: any;
  userEmail: string = '';
  username: string = '';
  particles: Particle[] = [];
  authService = inject(AuthService);

  constructor(private route: ActivatedRoute, private bookingService: BookingService) {
    this.generateParticles();
  }

  ngOnInit(): void {
    const storedUserData = this.authService.getUserData();
    const token = storedUserData?.token;

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userEmail = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '';
        this.username = decodedToken["name"] || 'User';
        console.log("✅ Extracted User Email:", this.userEmail);
      } catch (error) {
        console.error("❌ Error decoding JWT token:", error);
      }
    } else {
      console.error("❌ No token found in user data!");
    }

    window.scrollTo(0, 0);

    this.route.params.subscribe((params) => {
      this.reservationId = params['reservationId'] as string;
      console.log('Extracted Reservation ID:', this.reservationId);
      this.loadBookingInfo();
    });
  }

  private loadBookingInfo(): void {
    const bookingId = Number(this.reservationId);

    if (isNaN(bookingId)) {
      console.error('Invalid reservation ID:', this.reservationId);
      this.showErrorMessage('Invalid reservation ID');
      return;
    }

    this.bookingService.getBookingInformation(bookingId).subscribe({
      next: (data: any) => {
        console.log('Booking data received:', data);
        this.bookingInfo = data;
        this.flightInfo = data.flight;
      },
      error: (err) => {
        console.error('Error fetching booking info:', err);
        this.showErrorMessage('Failed to load booking information');
      },
    });
  }
  


  private generateParticles(): void {
    this.particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }));
  }

  printTicket(): void {
    window.print();
  }

  emailTicket(): void {
    if (!this.userEmail) {
      this.showErrorMessage("User email not found!");
      return;
    }
     const ticketElement = document.getElementById("ticketContainer");
  if (!ticketElement) {
    console.error("❌ Ticket container not found!");
    this.showErrorMessage("Ticket data is missing!");
    return;
  }

    html2canvas(ticketElement, { scale: 2 }).then((canvas) => {
     let ticketBase64 = canvas.toDataURL("image/png"); // ✅ Convert ticket to Base64

      // ✅ Remove Base64 prefix (data:image/png;base64,)
      ticketBase64 = ticketBase64.replace(/^data:image\/png;base64,/, "");


    const emailData = {
      to: this.userEmail,
      subject: "Booking Confirmation & E-Ticket",
      body: `
        Dear ${this.username},<br><br>
        Your flight booking is confirmed! Your ticket is attached below.<br><br>
        <b>Booking Reference:</b> ${this.bookingInfo?.bookingReference ?? 'N/A'}<br>
        <b>Flight Details:</b><br>
        Flight Number: ${this.bookingInfo?.flight?.flightNumber ?? 'N/A'}<br>
        Departure: ${this.bookingInfo?.flight?.departureDateTime ?? 'N/A'}<br>
        Arrival: ${this.bookingInfo?.flight?.arrivalDateTime ?? 'N/A'}<br><br>
        Please find your e-ticket attached below.<br>`,
      attachmentBase64: ticketBase64,
    };

    console.log("📩 Sending email with data:", emailData);

    this.bookingService.sendEmail(emailData).subscribe({
      next: (response) => {
        console.log("✅ Email sent successfully!", response);
        alert('Ticket has been sent to your email address!');
      },
      error: (err) => {
        console.error("❌ Error sending email:", err);
        this.showErrorMessage("Failed to send email. Please try again.");
      },
    });
  })
}

  downloadTicket(): void {
    alert('Ticket PDF download started!');
    this.emailTicket();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private showErrorMessage(message: string): void {
    console.error('Error:', message);
    alert(message);
  }
}



