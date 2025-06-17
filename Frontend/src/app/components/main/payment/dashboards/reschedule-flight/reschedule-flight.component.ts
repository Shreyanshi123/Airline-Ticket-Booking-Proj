import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightsService } from '../../../services/flights.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-reschedule-flight',
  imports:[ReactiveFormsModule],
  templateUrl: './reschedule-flight.component.html',
  styleUrls: ['./reschedule-flight.component.css']
})
export class RescheduleFlightComponent implements OnInit {
 
  rescheduleForm: FormGroup;
  flightId: any;
 
  constructor(private route: ActivatedRoute, private flightService: FlightsService, private router: Router) {
    this.rescheduleForm = new FormGroup({
      departureDateTime: new FormControl('', Validators.required),
      arrivalDateTime: new FormControl('', Validators.required),
      // status: new FormControl('', Validators.required)
    });
  }
 
  ngOnInit(): void {
    this.flightId = this.route.snapshot.paramMap.get('flightNumber');
 
    this.flightService.getFlightByFlightNumber(this.flightId).subscribe({
      next: (data: any) => {
        this.rescheduleForm.patchValue({
          departureDateTime: data.departureDateTime,
          arrivalDateTime: data.arrivalDateTime,
          // status: data.status // optional
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
  onSubmit(): void {
    if (this.rescheduleForm.valid) {
      this.flightService.rescheduleFlight(this.flightId, this.rescheduleForm.value).subscribe({
        next: () => {
          Swal.fire("Success", "Flight rescheduled successfully!", "success");
          this.router.navigate(['/dashboard/dashboard/schedule']);
        },
        error: (err) => {
          console.error(err);
          Swal.fire("Error", "Failed to reschedule flight", "error");
        }
      });
    }
  }
}