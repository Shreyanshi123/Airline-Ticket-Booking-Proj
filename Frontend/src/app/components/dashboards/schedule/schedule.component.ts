// import { CommonModule } from '@angular/common';
// import { Component} from '@angular/core';
// import { FormControl,FormGroup } from '@angular/forms';
// import { FlightsService } from '../../../services/flights.service';
// import { Router } from '@angular/router';
// // import Swal from 'sweetalert2';
// // import { SignalrService } from '../../../services/signalr.service';
// // import { provideToastr, ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-schedule',
//   standalone:true,
//   imports: [CommonModule],
//   templateUrl: './schedule.component.html',
//   styleUrl: './schedule.component.css'
// })
// export class ScheduleComponent {
//     notifications: string[] = [];

//   scheduleForm:FormGroup;
//   scheduleList:any= [];
//   statusMapping: { [key: number]: string } = {
//   0: "Scheduled ✈️",
//   1: "Delayed ⏳",
//   2: "Cancelled ❌",
//   3: "Completed ✅",
//   4:"Rescheduled",
//   5:"Unpredictable"
// };

//   getFlightStatus(status: number): string {
  
//   return this.statusMapping[status] || "Unknown"; // Default for unexpected values
// }

//   constructor(private flightService:FlightsService, private router:Router ){
//     this.scheduleForm= new FormGroup({
//       id: new FormControl(''),
//       airline: new FormControl(''),
//       flightNumber: new FormControl(''),
//       origin: new FormControl(''),
//       destination: new FormControl(''),
//       departureDateTime:new FormControl(''), 
//       arrivalDateTime:new FormControl(''), 
//       aircraft:new FormControl(''), 
//       economyPrice : new FormControl(''),
//       businessPrice : new FormControl(""),
//       availableBusinessSeats : new FormControl(''),
//       availableEconomySeats: new FormControl(''),
//       status: new FormControl("")
//     })
//   }

//   // 

//   ngOnInit():void{
//     // this.signalRService.startConnection().then(() => { // ✅ Ensure SignalR is connected first
//     // this.signalRService.listenForNotifications((message: string) => {
//     //   this.notifications.push(message);
//       //  this.toastr.info(message, "Flight Update!");
//       // Swal.fire({
//       //   title: 'Flight Update!',
//       //   text: message,
//       //   icon: 'info',
//       //   timer: 3000
//       // });
//     // });
//   // });

//     this.flightService.getFlights()
//     .subscribe({
//       next:(data:any)=>{
//         console.log(data);
//         this.scheduleList=data;
//       },
//       error:(err:any)=>{
//         console.log(err);
//       }
//     })
//   }

//   onEdit(flightId: any): void {
//     this.router.navigate(['dashboard/dashboard/editFlight', flightId]); // Redirect to Edit Page with Flight ID
//   }
//   onReschedule(flightId:any):void{
//     console.log(flightId)
//     this.router.navigate(['dashboard/dashboard/rescheduleFlight',flightId]);
//   }

//   onDelete(flightNumber:any):void{
//     console.log(flightNumber);
//       if (confirm('Are you sure you want to delete this flight schedule?')) {
//         this.flightService.deleteFlights(flightNumber).subscribe({
//           next:(data:any)=>{
//             this.scheduleList = this.scheduleList.filter((flight: any) => flight.FlightNumber !== flightNumber);
//             console.log(data);
//             alert('Flight schedule deleted successfully!');
//           },
//           error:(err)=>{
//             console.log(err);
//           }
//         })
//       }
//     }
//   }

//   // .subscribe(
//   //   () => {
//   //     // ✅ Remove the deleted flight from the schedule list
//   //    
//   //   },
//   //   (error) => {
//   //     console.error('Error deleting flight schedule:', error);
//   //     alert('Failed to delete flight schedule. Please try again.');
//   //   }
//   // );


import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlightsService } from '../../../services/flights.service';

import { Router } from '@angular/router';
 
@Component({

  selector: 'app-schedule',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule,FormsModule],

  templateUrl: './schedule.component.html',

  styleUrl: './schedule.component.css'

})

export class ScheduleComponent implements OnInit {

  notifications: string[] = [];

originQuery: string = '';
destinationQuery: string = '';
filteredScheduleList :any[] =[];


  scheduleForm: FormGroup;

  scheduleList: any = [];

  isLoading = false;

  statusMapping: { [key: number]: { text: string; class: string } } = {

    0: { text: "Scheduled", class: "status-scheduled" },

    1: { text: "Delayed", class: "status-delayed" },

    2: { text: "Cancelled", class: "status-cancelled" },

    3: { text: "Completed", class: "status-completed" },

    4: { text: "Rescheduled", class: "status-rescheduled" },

    5: { text: "Unpredictable", class: "status-unpredictable" }

  };
 
  getFlightStatus(status: number): { text: string; class: string } {

    return this.statusMapping[status] || { text: "Unknown", class: "status-unknown" };

  }
 
  constructor(private flightService: FlightsService, private router: Router) {

    this.scheduleForm = new FormGroup({

      id: new FormControl(''),

      airline: new FormControl(''),

      flightNumber: new FormControl(''),

      origin: new FormControl(''),

      destination: new FormControl(''),

      departureDateTime: new FormControl(''),

      arrivalDateTime: new FormControl(''),

      aircraft: new FormControl(''),

      economyPrice: new FormControl(''),

      businessPrice: new FormControl(""),

      availableBusinessSeats: new FormControl(''),

      availableEconomySeats: new FormControl(''),

      status: new FormControl("")

    });

  }
 
  ngOnInit(): void {

    this.loadFlights();

  }
 
  loadFlights(): void {

    this.isLoading = true;

    this.flightService.getFlights()

      .subscribe({

        next: (data: any) => {

          console.log(data);

          this.scheduleList = data;
              this.filteredScheduleList = data; // ✅

          this.isLoading = false;

        },

        error: (err: any) => {

          console.log(err);

          this.isLoading = false;

        }

      });

  }
 
   
filterFlights(): void {
  const origin = this.originQuery.toLowerCase().trim();
  const destination = this.destinationQuery.toLowerCase().trim();

  if (!origin && !destination) {
    this.filteredScheduleList = this.scheduleList;
    return;
  }

this.filteredScheduleList = this.scheduleList.filter((flight: any) => {
    const flightOrigin = flight.origin.toLowerCase();
    const flightDestination = flight.destination.toLowerCase();

    return (
      (!origin || flightOrigin.includes(origin)) &&
      (!destination || flightDestination.includes(destination))
    );
  });


  console.log("🔍 Filtered Flights:", this.filteredScheduleList);
}


  onEdit(flightId: any): void {

    this.router.navigate(['dashboard/editFlight', flightId]);

  }
 
  onReschedule(flightId: any): void {

    console.log(flightId);

    this.router.navigate(['dashboard/rescheduleFlight', flightId]);

  }
 
  onDelete(flightNumber: any): void {

    console.log(flightNumber);

    if (confirm('Are you sure you want to delete this flight schedule?')) {

      this.flightService.deleteFlights(flightNumber).subscribe({

        next: (data: any) => {

          this.scheduleList = this.scheduleList.filter((flight: any) => flight.FlightNumber !== flightNumber);

          console.log(data);

          alert('Flight schedule deleted successfully!');

        },

        error: (err) => {

          console.log(err);

        }

      });

    }

  }
 
  formatDate(dateString: string): string {

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {

      year: 'numeric',

      month: 'short',

      day: 'numeric',

      hour: '2-digit',

      minute: '2-digit'

    });

  }
 
  formatCurrency(amount: number): string {

    return new Intl.NumberFormat('en-US', {

      style: 'currency',

      currency: 'USD'

    }).format(amount);

  }

}
 