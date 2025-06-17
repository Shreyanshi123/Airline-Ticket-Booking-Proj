import { CommonModule } from "@angular/common"
import { Component, inject, type OnInit, type OnDestroy } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { FlightsService } from "../../../services/flights.service"
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { BookingService } from "../../../services/booking.service"
import { Subject, takeUntil } from "rxjs"
import Swal from "sweetalert2"

enum Gender {
  Male = 0,
  Female = 1,
}

enum SeatClass {
  Economy = 0,
  Business = 1,
}

interface Traveller {
  id: number
  firstName: string
  lastName: string
  seatClass: number
  price: number
  age: number
  gender: number
}

@Component({
  selector: "app-booking",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./booking.component.html",
  styleUrl: "./booking.component.css",
})
export class BookingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  // Data properties
  travellerList: Traveller[] = []
  flightDetails: any
  tripDetails: any
  flightNumber: any
  bookingId: any

  // UI state properties
  isEditing = false
  isProcessing = false
  isBooking = false
  showSuccessToast = false
  toastMessage = ""

  // Services
  flightService = inject(FlightsService)
  route = inject(ActivatedRoute)
  router = inject(Router)
  bookingService = inject(BookingService)

  // Form
  travellerForm: FormGroup

  constructor() {
    this.travellerForm = new FormGroup({
      id: new FormControl(""),
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      seatClass: new FormControl("Economy"),
      age: new FormControl("", [Validators.required, Validators.min(1), Validators.max(120)]),
      gender: new FormControl("", Validators.required),
    })
  }

  ngOnInit(): void {
     window.scrollTo(0, 0); // Scrolls to the top of the page
    this.travellerList = []
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.flightNumber = params["flightNumber"]

      this.flightService
        .getFlightByFlightNumber(this.flightNumber)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            console.log(data)
            this.flightDetails = data
            console.log(this.flightDetails)
          },
          error: (err) => {
            console.log(err)
            this.showToastMessage("Failed to load flight details. Please try again.")
          },
        })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Helper methods for labels
  getSeatClassLabel(value: number): string {
    const seatClassMap: Record<number, string> = {
      0: "Economy",
      1: "Business",
    }
    return seatClassMap[value] || "Unknown"
  }

  getGenderLabel(value: number): string {
    const genderMap: Record<number, string> = {
      0: "Male",
      1: "Female",
    }
    return genderMap[value] || "Unknown"
  }

  // New utility methods for template
  getPassengersByClass(className: string): Traveller[] {
    const classValue = className === 'Economy' ? SeatClass.Economy : SeatClass.Business;
    return this.travellerList.filter(traveller => traveller.seatClass === classValue);
  }

  calculateAirportTaxes(): number {
    // Calculate airport taxes as 10% of base fare
    const baseFare = this.travellerList.reduce((total, traveller) => total + traveller.price, 0);
    return 0;
  }

  calculateServiceCharges(): number {
    // Calculate service charges as $25 per passenger
    return this.travellerList.length * 0;
  }

  calculateGrandTotal(): number {
    const baseFare = this.calculateTotalFare();
    const taxes = this.calculateAirportTaxes();
    const service = this.calculateServiceCharges();
    return baseFare + taxes + service;
  }

  calculateSavings(): number {
    // Mock savings calculation - you can customize this logic
    return Math.round(this.calculateTotalFare() * 0.05);
  }

  // Utility methods
  calculateTotalFare(): number {
    return this.travellerList.reduce((total, traveller) => total + traveller.price, 0)
  }

  calculateFlightDuration(): string {
    if (!this.flightDetails?.departureDateTime || !this.flightDetails?.arrivalDateTime) {
      return "N/A"
    }

    const departure = new Date(this.flightDetails.departureDateTime)
    const arrival = new Date(this.flightDetails.arrivalDateTime)
    const durationMs = arrival.getTime() - departure.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  // Form validation helper methods
  hasFieldError(fieldName: string): boolean {
    const field = this.travellerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.travellerForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} must not exceed ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      age: 'Age',
      gender: 'Gender',
      seatClass: 'Seat Class'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Form methods
  addTraveller(): void {
    if (this.travellerForm.invalid) {
      this.markFormGroupTouched()
      this.showToastMessage("Please fill in all required fields correctly.")
      return
    }

    this.isProcessing = true

    // Simulate processing delay for better UX
    setTimeout(() => {
      const seatClass = this.travellerForm.get("seatClass")?.value
      const price = seatClass === "Economy" ? this.flightDetails.economyPrice : this.flightDetails.businessPrice

      const newTraveller: Traveller = {
        id: this.travellerList.length,
        firstName: this.travellerForm.get("firstName")?.value,
        lastName: this.travellerForm.get("lastName")?.value,
        seatClass: SeatClass[this.travellerForm.get("seatClass")?.value as keyof typeof SeatClass],
        price: price,
        age: this.travellerForm.get("age")?.value,
        gender: Gender[this.travellerForm.get("gender")?.value as keyof typeof Gender],
      }

      console.log("New Traveller Added:", newTraveller)
      this.travellerList.push(newTraveller)
      console.log(this.travellerList)

      this.travellerForm.reset()
      this.travellerForm.patchValue({ seatClass: "Economy" }) // Reset to default
      this.isProcessing = false
      this.isEditing = false // Reset editing state

      this.showToastMessage(`${newTraveller.firstName} ${newTraveller.lastName} added successfully!`)
    }, 800)
  }

  editTraveller(index: number): void {
    const traveller = this.travellerList[index]
    if (!traveller) return

    this.travellerForm.patchValue({
      id: traveller.id,
      firstName: traveller.firstName,
      lastName: traveller.lastName,
      seatClass: this.getSeatClassLabel(traveller.seatClass),
      age: traveller.age,
      gender: this.getGenderLabel(traveller.gender),
    })

    this.isEditing = true
    this.removeTraveller(index)
  }

  removeTraveller(index: number): void {
    const traveller = this.travellerList[index]
    if (!traveller) return

    // If we're in editing mode, just remove without confirmation
    if (this.isEditing) {
      this.travellerList.splice(index, 1)
      // Update IDs
      this.travellerList.forEach((t, i) => (t.id = i))
      return
    }

    Swal.fire({
      title: "Remove Passenger?",
      text: `Are you sure you want to remove ${traveller.firstName} ${traveller.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#718096",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.travellerList.splice(index, 1)
        // Update IDs
        this.travellerList.forEach((t, i) => (t.id = i))
        this.showToastMessage(`${traveller.firstName} ${traveller.lastName} removed successfully.`)
      }
    })
  }

  private markFormGroupTouched(): void {
    Object.keys(this.travellerForm.controls).forEach((key) => {
      const control = this.travellerForm.get(key)
      control?.markAsTouched()
    })
  }

  // Booking method
  ProceedToBooking(): void {
    if (this.travellerList.length === 0) {
      this.showToastMessage("Please add at least one passenger to proceed.")
      return
    }

    Swal.fire({
      title: "Confirm Booking",
      html: `
        <div style="text-align: left; margin: 1rem 0;">
          <p><strong>Flight:</strong> ${this.flightDetails?.flightNumber}</p>
          <p><strong>Route:</strong> ${this.flightDetails?.origin} → ${this.flightDetails?.destination}</p>
          <p><strong>Passengers:</strong> ${this.travellerList.length}</p>
          <p><strong>Total Amount:</strong> $${this.calculateGrandTotal()}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#667eea",
      cancelButtonColor: "#718096",
      confirmButtonText: "Confirm Booking",
      cancelButtonText: "Review Details",
    }).then((result) => {
      if (result.isConfirmed) {
        this.processBooking()
      }
    })
  }

  private processBooking(): void {
    this.isBooking = true
    console.log(this.travellerList)

    this.bookingService
      .bookTickets(this.flightNumber, this.travellerList)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log(data)
          this.bookingId = data.id
          this.isBooking = false

          Swal.fire({
            title: "Booking Confirmed!",
            html: `
              <div style="text-align: center; margin: 1rem 0;">
                <div style="font-size: 3rem; color: #43e97b; margin-bottom: 1rem;">
                  <i class="fas fa-check-circle"></i>
                </div>
                <p><strong>Booking ID:</strong> ${this.bookingId}</p>
                <p>Redirecting to confirmation page...</p>
              </div>
            `,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
            allowOutsideClick: false,
          }).then(() => {
            this.router.navigate(["/booking-confirmation", this.bookingId])
          })
        },
        error: (err) => {
          console.log(err)
          this.isBooking = false
          Swal.fire({
            title: "Booking Failed",
            text: "There was an error processing your booking. Please try again.",
            icon: "error",
            confirmButtonColor: "#667eea",
          })
        },
      })
  }

  getEconomyPassengerTotal(): number
{
  return this.getPassengersByClass('Economy').reduce((total, passenger) => total + passenger.price, 0);
}

getBusinessPassengerTotal()
: number
{
  return this.getPassengersByClass('Business').reduce((total, passenger) => total + passenger.price, 0);
}

  // Toast methods
  private showToastMessage(message: string): void {
    this.toastMessage = message
    this.showSuccessToast = true

    // Auto hide after 4 seconds
    setTimeout(() => {
      this.hideToast()
    }, 4000)
  }

  hideToast(): void {
    this.showSuccessToast = false
  }

  // Utility methods for template
  trackByTravellerId(index: number, traveller: Traveller): number {
    return traveller.id
  }
}