import { Component, OnInit } from '@angular/core';
import { FlightsService } from '../../../services/flights.service';
import { FormGroup ,FormControl, ReactiveFormsModule,Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-editairline',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './editairline.component.html',
  styleUrl: './editairline.component.css'
})
export class EditairlineComponent implements OnInit {
    flightNumber:any;
    editFlightForm:FormGroup;
     statusMapping: { [key: number]: string } = {
  0: "Scheduled ✈️",
  1: "Delayed ⏳",
  2: "Cancelled ❌",
  3: "Completed ✅"
};

  getFlightStatus(status: number): string {
  
  return this.statusMapping[status] || "Unknown"; // Default for unexpected values
}

getStatusKeys= (): number[] => {
  console.log("Status keys:", Object.keys(this.statusMapping).map(Number)); // ✅ Debugging output
  return Object.keys(this.statusMapping).map(Number);
}

    constructor(
      private flightService: FlightsService,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.editFlightForm = new FormGroup({
        flightNumber: new FormControl('', Validators.required),
        origin: new FormControl('', Validators.required),
        destination: new FormControl('', Validators.required),
        departureDateTime: new FormControl('', Validators.required),
        arrivalDateTime: new FormControl('', Validators.required),
         aircraft:new FormControl(''), 
      economyPrice : new FormControl(''),
      businessPrice : new FormControl(""),
        airline: new FormControl(''),
        id: new FormControl(''),
        availableBusinessSeats: new FormControl(''),
        availableEconomySeats:new FormControl(''),
        status: new FormControl('')
      });
    }

    ngOnInit(): void {
      this.route.params.subscribe(params=>{
        this.flightNumber=params['flightNumber'];

        this.flightService.getFlightByFlightNumber(this.flightNumber).subscribe({
            next:(data:any)=>{
              console.log(data);
              this.editFlightForm.patchValue(data);
            },
            error:(err)=>{
              console.log(err);
            }
        })
      })
    }

    onSubmit():void{
      if (this.editFlightForm.invalid) {
        Swal.fire('Please fill in all required fields correctly.');
        return;
      }
  
      const updatedFlightData = this.editFlightForm.value;
      console.log(updatedFlightData);
       updatedFlightData.status = Number(updatedFlightData.status); 


      this.flightService.updateFlight(this.flightNumber, updatedFlightData).subscribe({
        next: (data:any) => {
          console.log(data);
          Swal.fire('Flight updated successfully!');
          this.router.navigate(['dashboard/dashboard/schedule']); // Redirect to flight list
        },
        error: (err:any) => {
          console.log(err);
          Swal.fire('Error updating flight. Please try again.');
        }
      });
  
    }

}


