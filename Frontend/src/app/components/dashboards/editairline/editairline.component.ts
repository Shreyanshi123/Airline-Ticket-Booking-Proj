// import { Component, OnInit } from '@angular/core';
// import { FlightsService } from '../../../services/flights.service';
// import { FormGroup ,FormControl, ReactiveFormsModule,Validators} from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-editairline',
//   standalone:true,
//   imports: [ReactiveFormsModule,CommonModule],
//   templateUrl: './editairline.component.html',
//   styleUrl: './editairline.component.css'
// })
// export class EditairlineComponent implements OnInit {
//     flightNumber:any;
//     editFlightForm:FormGroup;
//      statusMapping: { [key: number]: string } = {
//   0: "Scheduled ✈️",
//   1: "Delayed ⏳",
//   2: "Cancelled ❌",
//   3: "Completed ✅"
// };

//   getFlightStatus(status: number): string {
  
//   return this.statusMapping[status] || "Unknown"; // Default for unexpected values
// }

// getStatusKeys= (): number[] => {
//   console.log("Status keys:", Object.keys(this.statusMapping).map(Number)); // ✅ Debugging output
//   return Object.keys(this.statusMapping).map(Number);
// }

//     constructor(
//       private flightService: FlightsService,
//       private route: ActivatedRoute,
//       private router: Router
//     ) {
//       this.editFlightForm = new FormGroup({
//         flightNumber: new FormControl('', Validators.required),
//         origin: new FormControl('', Validators.required),
//         destination: new FormControl('', Validators.required),
//         departureDateTime: new FormControl('', Validators.required),
//         arrivalDateTime: new FormControl('', Validators.required),
//          aircraft:new FormControl(''), 
//       economyPrice : new FormControl(''),
//       businessPrice : new FormControl(""),
//         airline: new FormControl(''),
//         id: new FormControl(''),
//         availableBusinessSeats: new FormControl(''),
//         availableEconomySeats:new FormControl(''),
//         status: new FormControl('')
//       });
//     }

//     ngOnInit(): void {
//       this.route.params.subscribe(params=>{
//         this.flightNumber=params['flightNumber'];

//         this.flightService.getFlightByFlightNumber(this.flightNumber).subscribe({
//             next:(data:any)=>{
//               console.log(data);
//               this.editFlightForm.patchValue(data);
//             },
//             error:(err)=>{
//               console.log(err);
//             }
//         })
//       })
//     }

//     onSubmit():void{
//       if (this.editFlightForm.invalid) {
//         Swal.fire('Please fill in all required fields correctly.');
//         return;
//       }
  
//       const updatedFlightData = this.editFlightForm.value;
//       console.log(updatedFlightData);
//        updatedFlightData.status = Number(updatedFlightData.status); 


//       this.flightService.updateFlight(this.flightNumber, updatedFlightData).subscribe({
//         next: (data:any) => {
//           console.log(data);
//           Swal.fire('Flight updated successfully!');
//           this.router.navigate(['dashboard/dashboard/schedule']); // Redirect to flight list
//         },
//         error: (err:any) => {
//           console.log(err);
//           Swal.fire('Error updating flight. Please try again.');
//         }
//       });
  
//     }

// }



import { Component, OnInit } from '@angular/core';

import { FlightsService } from '../../../services/flights.service';

import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
 
@Component({

  selector: 'app-editairline',

  standalone: true,

  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './editairline.component.html',

  styleUrl: './editairline.component.css'

})

export class EditairlineComponent implements OnInit {

  flightNumber: any;

  editFlightForm: FormGroup;

  isLoading = false;

  statusMapping: { [key: number]: string } = {

    0: "Scheduled ✈️",

    1: "Delayed ⏳",

    2: "Cancelled ❌",

    3: "Completed ✅"

  };
 
  getFlightStatus(status: number): string {

    return this.statusMapping[status] || "Unknown";

  }
 
  getStatusKeys = (): number[] => {

    console.log("Status keys:", Object.keys(this.statusMapping).map(Number));

    return Object.keys(this.statusMapping).map(Number);

  }
 
  constructor(

    private flightService: FlightsService,

    private route: ActivatedRoute,

    private router: Router

  ) {

    this.editFlightForm = new FormGroup({

      flightNumber: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{3,4}$/)]),

      origin: new FormControl('', [Validators.required, Validators.minLength(3)]),

      destination: new FormControl('', [Validators.required, Validators.minLength(3)]),

      departureDateTime: new FormControl('', Validators.required),

      arrivalDateTime: new FormControl('', Validators.required),

      aircraft: new FormControl(''),

      economyPrice: new FormControl('', [Validators.required, Validators.min(0)]),

      businessPrice: new FormControl('', [Validators.required, Validators.min(0)]),

      airline: new FormControl('', Validators.required),

      id: new FormControl(''),

      availableBusinessSeats: new FormControl('', [Validators.required, Validators.min(0)]),

      availableEconomySeats: new FormControl('', [Validators.required, Validators.min(0)]),

      status: new FormControl('', Validators.required)

    });

  }
 
  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.flightNumber = params['flightNumber'];

      this.loadFlightData();

    });

  }
 
  loadFlightData(): void {

    this.isLoading = true;

    this.flightService.getFlightByFlightNumber(this.flightNumber).subscribe({

      next: (data: any) => {

        console.log(data);

        this.editFlightForm.patchValue(data);

        this.isLoading = false;

      },

      error: (err) => {

        console.log(err);

        this.isLoading = false;

        Swal.fire({

          icon: 'error',

          title: 'Error',

          text: 'Failed to load flight data. Please try again.'

        });

      }

    });

  }
 
  onSubmit(): void {

    if (this.editFlightForm.invalid) {

      this.markFormGroupTouched();

      Swal.fire({

        icon: 'warning',

        title: 'Validation Error',

        text: 'Please fill in all required fields correctly.'

      });

      return;

    }
 
    this.isLoading = true;

    const updatedFlightData = this.editFlightForm.value;

    console.log(updatedFlightData);

    updatedFlightData.status = Number(updatedFlightData.status);
 
    this.flightService.updateFlight(this.flightNumber, updatedFlightData).subscribe({

      next: (data: any) => {

        console.log(data);

        this.isLoading = false;

        Swal.fire({

          icon: 'success',

          title: 'Success!',

          text: 'Flight updated successfully!'

        }).then(() => {

          this.router.navigate(['dashboard/dashboard/schedule']);

        });

      },

      error: (err: any) => {

        console.log(err);

        this.isLoading = false;

        Swal.fire({

          icon: 'error',

          title: 'Error',

          text: 'Error updating flight. Please try again.'

        });

      }

    });

  }
 
  private markFormGroupTouched(): void {

    Object.keys(this.editFlightForm.controls).forEach(key => {

      const control = this.editFlightForm.get(key);

      control?.markAsTouched();

    });

  }
 
  onCancel(): void {

    this.router.navigate(['dashboard/dashboard/schedule']);

  }
 
  isFieldInvalid(fieldName: string): boolean {

    const field = this.editFlightForm.get(fieldName);

    return !!(field && field.invalid && (field.dirty || field.touched));

  }
 
  getFieldErrorMessage(fieldName: string): string {

    const field = this.editFlightForm.get(fieldName);

    if (field?.errors) {

      if (field.errors['required']) return `${fieldName} is required`;

      if (field.errors['pattern']) return 'Invalid format';

      if (field.errors['minLength']) return `Minimum ${field.errors['minLength'].requiredLength} characters required`;

      if (field.errors['min']) return 'Value must be greater than 0';

    }

    return '';

  }

}
 


