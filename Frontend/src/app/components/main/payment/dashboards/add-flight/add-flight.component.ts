

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightsService } from '../../../services/flights.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-flight',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-flight.component.html',
  styleUrl: './add-flight.component.css'
})
export class AddFlightComponent {


  statusKeys(): number[] {
  return Object.keys(this.statusMapping).map(Number);
}


  statusMapping: { [key: number]: string } = {
    0: "Scheduled ✈️",
    1: "Delayed ⏳",
    2: "Cancelled ❌",
    3: "Completed ✅"
  };

  addFlightForm: FormGroup;

  constructor(private flightService: FlightsService) {
    this.addFlightForm = new FormGroup({
      flightNumber: new FormControl('', Validators.required),
      airline: new FormControl('', Validators.required),
      origin: new FormControl('', Validators.required),
      destination: new FormControl('', Validators.required),
      departureDateTime: new FormControl('', Validators.required),
      arrivalDateTime: new FormControl('', Validators.required),
      availableBusinessSeats: new FormControl('', Validators.required),
      availableEconomySeats: new FormControl('', Validators.required),
      businessPrice: new FormControl('', Validators.required),
      economyPrice: new FormControl('', Validators.required),
      status: new FormControl(0),
      aircraft: new FormControl('')
    });
  }

  onSubmit(): void {
    if (this.addFlightForm.invalid) {
      Swal.fire('Please fill in all required fields correctly.');
      console.log('Validation Errors:', this.addFlightForm.errors);
      return;
    }

    const formData = { ...this.addFlightForm.value, status: Number(this.addFlightForm.value.status) };
    console.log('Submitted Flight Data:', formData);

    this.flightService.addFlights(formData).subscribe({
      next: (data: any) => {
        console.log('Flight added:', data);
        Swal.fire('Flight added successfully!');
        this.addFlightForm.reset();
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Error adding flight. Please try again.');
      }
    });
  }
}