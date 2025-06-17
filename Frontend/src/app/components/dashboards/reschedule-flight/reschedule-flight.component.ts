// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FlightsService } from '../../../services/flights.service';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import Swal from 'sweetalert2';
 
// @Component({
//   selector: 'app-reschedule-flight',
//   imports:[ReactiveFormsModule],
//   templateUrl: './reschedule-flight.component.html',
//   styleUrls: ['./reschedule-flight.component.css']
// })
// export class RescheduleFlightComponent implements OnInit {
 
//   rescheduleForm: FormGroup;
//   flightId: any;
 
//   constructor(private route: ActivatedRoute, private flightService: FlightsService, private router: Router) {
//     this.rescheduleForm = new FormGroup({
//       departureDateTime: new FormControl('', Validators.required),
//       arrivalDateTime: new FormControl('', Validators.required),
//       // status: new FormControl('', Validators.required)
//     });
//   }
 
//   ngOnInit(): void {
//     this.flightId = this.route.snapshot.paramMap.get('flightNumber');
 
//     this.flightService.getFlightByFlightNumber(this.flightId).subscribe({
//       next: (data: any) => {
//         this.rescheduleForm.patchValue({
//           departureDateTime: data.departureDateTime,
//           arrivalDateTime: data.arrivalDateTime,
//           // status: data.status // optional
//         });
//       },
//       error: (err) => {
//         console.error(err);
//       }
//     });
//   }
 
//   onSubmit(): void {
//     if (this.rescheduleForm.valid) {
//       this.flightService.rescheduleFlight(this.flightId, this.rescheduleForm.value).subscribe({
//         next: () => {
//           Swal.fire("Success", "Flight rescheduled successfully!", "success");
//           this.router.navigate(['/dashboard/dashboard/schedule']);
//         },
//         error: (err) => {
//           console.error(err);
//           Swal.fire("Error", "Failed to reschedule flight", "error");
//         }
//       });
//     }
//   }
// }


// reschedule-flight.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightsService } from '../../../services/flights.service';
import { FormControl, FormGroup, ValidationErrors, AbstractControl,ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reschedule-flight',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reschedule-flight.component.html',
  styleUrls: ['./reschedule-flight.component.css']
})
export class RescheduleFlightComponent implements OnInit {
  rescheduleForm: FormGroup;
  flightId: any;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  flightDetails: any = null;

  constructor(
    private route: ActivatedRoute, 
    private flightService: FlightsService, 
    private router: Router
  ) {
    this.rescheduleForm = new FormGroup({
      departureDateTime: new FormControl('', [
        Validators.required,
        this.futureDateValidator
      ]),
      arrivalDateTime: new FormControl('', [
        Validators.required,
        this.futureDateValidator
      ]),
      reason: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.flightId = this.route.snapshot.paramMap.get('flightNumber');
    this.loadFlightDetails();
    
    // Add cross-field validation
    this.rescheduleForm.setValidators(this.dateOrderValidator.bind(this));
  }

  loadFlightDetails(): void {
    this.isLoading = true;
    this.flightService.getFlightByFlightNumber(this.flightId).subscribe({
      next: (data: any) => {
        this.flightDetails = data;
        // Format datetime for datetime-local input
        const departureFormatted = this.formatDateTimeForInput(data.departureDateTime);
        const arrivalFormatted = this.formatDateTimeForInput(data.arrivalDateTime);
        
        this.rescheduleForm.patchValue({
          departureDateTime: departureFormatted,
          arrivalDateTime: arrivalFormatted
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        Swal.fire("Error", "Failed to load flight details", "error");
      }
    });
  }

  formatDateTimeForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

 futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selectedDate = new Date(control.value);
  const currentDate = new Date();
  return selectedDate > currentDate ? null : { pastDate: true };
}

dateOrderValidator(form: AbstractControl): ValidationErrors | null {
  const departure = form.get('departureDateTime')?.value;
  const arrival = form.get('arrivalDateTime')?.value;

  if (!departure || !arrival) return null;

  const departureDate = new Date(departure);
  const arrivalDate = new Date(arrival);

  return departureDate < arrivalDate ? null : { invalidOrder: true };
}

  onSubmit(): void {
    if (this.rescheduleForm.valid) {
      this.isSubmitting = true;
      
      const formData = {
        ...this.rescheduleForm.value,
        departureDateTime: new Date(this.rescheduleForm.value.departureDateTime).toISOString(),
        arrivalDateTime: new Date(this.rescheduleForm.value.arrivalDateTime).toISOString()
      };

      this.flightService.rescheduleFlight(this.flightId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          Swal.fire({
            title: "Success!",
            text: "Flight rescheduled successfully!",
            icon: "success",
            confirmButtonColor: "#667eea"
          }).then(() => {
            this.router.navigate(['/dashboard/dashboard/schedule']);
          });
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          Swal.fire({
            title: "Error!",
            text: "Failed to reschedule flight. Please try again.",
            icon: "error",
            confirmButtonColor: "#667eea"
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.rescheduleForm.controls).forEach(key => {
      this.rescheduleForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/dashboard/schedule']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.rescheduleForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (field?.hasError('pastDate')) {
      return 'Date must be in the future';
    }
    if (this.rescheduleForm.hasError('invalidOrder') && (fieldName === 'departureDateTime' || fieldName === 'arrivalDateTime')) {
      return 'Departure time must be before arrival time';
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'departureDateTime': 'Departure Date & Time',
      'arrivalDateTime': 'Arrival Date & Time',
      'reason': 'Reason for Reschedule'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.rescheduleForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
