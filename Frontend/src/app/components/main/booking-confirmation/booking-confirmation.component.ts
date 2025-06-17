// import { Component, inject, type OnInit, type OnDestroy } from "@angular/core"
// import { ActivatedRoute, Router } from "@angular/router"
// import { BookingService } from "../../../services/booking.service"
// import { CommonModule } from "@angular/common"
// import { FormGroup, FormControl, ReactiveFormsModule, Validators } from "@angular/forms"
// import { Subject, takeUntil } from "rxjs"
// import Swal from "sweetalert2"

// enum Gender {
//   Male = 0,
//   Female = 1,
// }

// enum SeatClass {
//   Economy = 0,
//   Business = 1,
// }

// interface Passenger {
//   id: number
//   firstName: string
//   lastName: string
//   age: number
//   gender: number
//   seatClass: number
// }

// @Component({
//   selector: "app-booking-confirmation",
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: "./booking-confirmation.component.html",
//   styleUrls: ["./booking-confirmation.component.css"],
// })
// export class BookingConfirmationComponent implements OnInit, OnDestroy {
//   private destroy$ = new Subject<void>()

//   // Data properties
//   flightDetails: any
//   travellerList: Passenger[] = []
//   FlightId: any
//   bookingId: any
//   id: any
//   totalAmount: any

//   // UI state properties
//   isEditing = false
//   isUpdating = false
//   isProcessingPayment = false
//   editIndex!: number
//   showToast = false
//   toastMessage = ""
//   toastType = "success"
//   toastIcon = "fas fa-check-circle"

//   // Services
//   route = inject(ActivatedRoute)
//   bookingService = inject(BookingService)
//   router = inject(Router)

//   // Form
//   travellerForm: FormGroup

//   constructor() {
//     this.travellerForm = new FormGroup({
//       id: new FormControl(null),
//       firstName: new FormControl("", Validators.required),
//       lastName: new FormControl("", Validators.required),
//       age: new FormControl("", [Validators.required, Validators.min(1), Validators.max(120)]),
//       gender: new FormControl("", Validators.required),
//       seatClass: new FormControl("Economy"),
//     })

//     this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
//       this.FlightId = params["flightId"]
//       this.loadBookingInformation()
//     })
//   }

//   ngOnInit() {
//     // Additional initialization if needed
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next()
//     this.destroy$.complete()
//   }

//   private loadBookingInformation(): void {
//     this.bookingService
//       .getBookingInformation(this.FlightId)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (data: any) => {
//           console.log(data)
//           this.id = data.id
//           this.bookingId = data.bookingReference
//           this.flightDetails = data.flight
//           this.travellerList = data.passengers
//           this.totalAmount = data.totalAmount

//           // Prefill the form with the first passenger's data by default
//           if (this.travellerList.length > 0) {
//             this.travellerForm.patchValue(this.travellerList[0])
//           }
//         },
//         error: (err) => {
//           console.log(err)
//           this.showToastMessage("error", "Failed to load booking information. Please try again.")
//         },
//       })
//   }

//   // Helper methods for labels
//   getSeatClassLabel(value: number): string {
//     const seatClassMap: Record<number, string> = {
//       0: "Economy",
//       1: "Business",
//     }
//     return seatClassMap[value] || "Unknown"
//   }

//   getGenderLabel(value: number): string {
//     const genderMap: Record<number, string> = {
//       0: "Male",
//       1: "Female",
//     }
//     return genderMap[value] || "Unknown"
//   }

//   // Utility methods
//   calculateTotalFare(): number {
//     return this.travellerList.reduce((total, traveller) => total + (traveller as any).price || 0, 0)
//   }

//   calculateFlightDuration(): string {
//     if (!this.flightDetails?.departureDateTime || !this.flightDetails?.arrivalDateTime) {
//       return "N/A"
//     }

//     const departure = new Date(this.flightDetails.departureDateTime)
//     const arrival = new Date(this.flightDetails.arrivalDateTime)
//     const durationMs = arrival.getTime() - departure.getTime()
//     const hours = Math.floor(durationMs / (1000 * 60 * 60))
//     const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

//     return `${hours}h ${minutes}m`
//   }

//   getCurrentDate(): Date {
//     return new Date()
//   }

//   getOriginCity(): string {
//     return this.flightDetails?.origin || "N/A"
//   }

//   getDestinationCity(): string {
//     return this.flightDetails?.destination || "N/A"
//   }

//   // Passenger management methods
//   editPassenger(traveller: Passenger, index: number): void {
//     console.log(traveller)
//     this.travellerForm.patchValue({
//       id: index,
//       firstName: traveller.firstName,
//       lastName: traveller.lastName,
//       age: traveller.age,
//       gender: this.getGenderLabel(traveller.gender),
//       seatClass: this.getSeatClassLabel(traveller.seatClass),
//     })

//     this.isEditing = true
//     this.editIndex = index
//     console.log(this.travellerForm.value)
//   }

//   updatePassenger(): void {
//     if (this.travellerForm.invalid) {
//       this.showToastMessage("error", "Please fill in all required fields correctly.")
//       return
//     }

//     this.isUpdating = true

//     const genderValue = this.travellerForm.get("gender")?.value
//     const seatClassValue = this.travellerForm.get("seatClass")?.value

//     // Convert gender and seatClass to correct enum format with validation
//     const formattedGender = genderValue === "Male" ? 0 : genderValue === "Female" ? 1 : 0 // Default to Male if invalid
//     const formattedSeatClass = seatClassValue === "Economy" ? 0 : seatClassValue === "Business" ? 1 : 0 // Default to Economy if invalid

//     // Validate that we have valid enum values
//     if (formattedGender === null || formattedSeatClass === null) {
//       this.showToastMessage("error", "Invalid gender or seat class selection.")
//       this.isUpdating = false
//       return
//     }

//     const updatedPassenger: Passenger = {
//       id: this.travellerForm.get("id")?.value,
//       firstName: this.travellerForm.get("firstName")?.value,
//       lastName: this.travellerForm.get("lastName")?.value,
//       age: this.travellerForm.get("age")?.value,
//       gender: formattedGender,
//       seatClass: formattedSeatClass,
//     }

//     console.log("Updating Passenger:", updatedPassenger)

//     if (updatedPassenger.id === undefined) {
//       this.showToastMessage("error", "Cannot update passenger: ID is missing.")
//       this.isUpdating = false
//       return
//     }

//     console.log(this.FlightId)
//     this.bookingService
//       .updatePassenger(this.FlightId, updatedPassenger)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           this.showToastMessage("success", "Passenger updated successfully!")

//           this.travellerList = this.travellerList.map((passenger) =>
//             passenger.id === updatedPassenger.id ? { ...passenger, ...updatedPassenger } : passenger,
//           )

//           this.isEditing = false
//           this.isUpdating = false
//           this.travellerForm.reset()
//         },
//         error: (err) => {
//           console.error("Error updating passenger:", err)
//           this.showToastMessage("error", "Failed to update passenger. Please try again.")
//           this.isUpdating = false
//         },
//       })
//   }

//   cancelEdit(): void {
//     this.isEditing = false
//     this.isUpdating = false
//     this.travellerForm.reset()
//   }

//   // Payment and actions
//   proceedToPayment(): void {
//     Swal.fire({
//       title: "Proceed to Payment?",
//       html: `
//         <div style="text-align: left; margin: 1rem 0;">
//           <p><strong>Booking Reference:</strong> ${this.bookingId}</p>
//           <p><strong>Total Amount:</strong> $${this.totalAmount}</p>
//           <p><strong>Passengers:</strong> ${this.travellerList.length}</p>
//         </div>
//       `,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#667eea",
//       cancelButtonColor: "#718096",
//       confirmButtonText: "Proceed to Payment",
//       cancelButtonText: "Cancel",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.isProcessingPayment = true

//         // Simulate processing delay
//         setTimeout(() => {
//           this.router.navigate(["/payment", this.id])
//           this.isProcessingPayment = false
//         }, 2000)
//       }
//     })
//   }

//   // Additional action methods
//   copyBookingId(): void {
//     if (!this.bookingId) return

//     navigator.clipboard
//       .writeText(this.bookingId)
//       .then(() => {
//         this.showToastMessage("success", "Booking reference copied to clipboard!")
//       })
//       .catch(() => {
//         this.showToastMessage("error", "Failed to copy booking reference. Please try again.")
//       })
//   }

//   downloadTicket(): void {
//     this.showToastMessage("info", "Downloading your e-ticket...")

//     // Simulate download process
//     setTimeout(() => {
//       this.showToastMessage("success", "E-ticket downloaded successfully!")
//     }, 2000)
//   }

//   shareBooking(): void {
//     const shareData = {
//       title: "Flight Booking Confirmation",
//       text: `Booking Reference: ${this.bookingId} - Flight ${this.flightDetails?.flightNumber}`,
//       url: window.location.href,
//     }

//     if (navigator.share) {
//       navigator
//         .share(shareData)
//         .then(() => {
//           this.showToastMessage("success", "Booking details shared successfully!")
//         })
//         .catch((error) => {
//           console.error("Error sharing:", error)
//           this.fallbackShare()
//         })
//     } else {
//       this.fallbackShare()
//     }
//   }

//   private fallbackShare(): void {
//     const url = window.location.href
//     navigator.clipboard
//       .writeText(url)
//       .then(() => {
//         this.showToastMessage("success", "Booking link copied to clipboard!")
//       })
//       .catch(() => {
//         this.showToastMessage("info", "Share link: " + url)
//       })
//   }

//   addToCalendar(): void {
//     if (!this.flightDetails) {
//       this.showToastMessage("error", "Flight details not available.")
//       return
//     }

//     const startDate = new Date(this.flightDetails.departureDateTime)
//     const endDate = new Date(this.flightDetails.arrivalDateTime)

//     const calendarEvent = {
//       title: `Flight ${this.flightDetails.flightNumber} - ${this.flightDetails.origin} to ${this.flightDetails.destination}`,
//       start: startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
//       end: endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
//       description: `Booking Reference: ${this.bookingId}`,
//     }

//     const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
//       calendarEvent.title,
//     )}&dates=${calendarEvent.start}/${calendarEvent.end}&details=${encodeURIComponent(calendarEvent.description)}`

//     window.open(calendarUrl, "_blank")
//     this.showToastMessage("success", "Opening calendar to add your flight!")
//   }

//   // Toast methods
//   private showToastMessage(type: "success" | "error" | "info", message: string): void {
//     this.toastType = type
//     this.toastMessage = message
//     this.toastIcon = this.getToastIcon(type)
//     this.showToast = true

//     // Auto hide after 4 seconds
//     setTimeout(() => {
//       this.hideToast()
//     }, 4000)
//   }

//   private getToastIcon(type: string): string {
//     switch (type) {
//       case "success":
//         return "fas fa-check-circle"
//       case "error":
//         return "fas fa-exclamation-circle"
//       case "info":
//         return "fas fa-info-circle"
//       default:
//         return "fas fa-bell"
//     }
//   }

//   hideToast(): void {
//     this.showToast = false
//   }

//   // Utility methods for template
//   trackByPassengerId(index: number, passenger: Passenger): number {
//     return passenger.id
//   }
// }

import { Component, inject, type OnInit, type OnDestroy } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { BookingService } from "../../../services/booking.service"
import { CommonModule } from "@angular/common"
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from "@angular/forms"
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

interface Passenger {
  id: number
  firstName: string
  lastName: string
  age: number
  gender: number
  seatClass: number
  price?: number
}

interface FlightDetails {
  id: string
  flightNumber: string
  airline: string
  origin: string
  destination: string
  departureDateTime: string
  arrivalDateTime: string
}

interface BookingData {
  id: string
  bookingReference: string
  flight: FlightDetails
  passengers: Passenger[]
  totalAmount: number
}

@Component({
  selector: "app-booking-confirmation",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./booking-confirmation.component.html",
  styleUrls: ["./booking-confirmation.component.css"],
})
export class BookingConfirmationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  // Data properties
  flightDetails: FlightDetails | null = null
  travellerList: Passenger[] = []
  FlightId = ""
  bookingId = ""
  id = ""
  totalAmount = 0

  // UI state properties
  isEditing = false
  isUpdating = false
  isProcessingPayment = false
  isLoading = true
  editIndex = -1
  showToast = false
  toastMessage = ""
  toastType: "success" | "error" | "info" = "success"
  toastIcon = "fas fa-check-circle"

  // Services
  private route = inject(ActivatedRoute)
  private bookingService = inject(BookingService)
  private router = inject(Router)

  // Form
  travellerForm: FormGroup

  constructor() {
    this.travellerForm = new FormGroup({
      id: new FormControl(null),
      firstName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      age: new FormControl("", [Validators.required, Validators.min(1), Validators.max(120)]),
      gender: new FormControl("", Validators.required),
      seatClass: new FormControl("Economy", Validators.required),
    })
  }

  ngOnInit(): void {
     window.scrollTo(0, 0); // Scrolls to the top of the page
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.FlightId = params["flightId"]
      if (this.FlightId) {
        this.loadBookingInformation()
      } else {
        this.showToastMessage("error", "Invalid flight ID")
        this.isLoading = false
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

private loadBookingInformation(): void {
  this.isLoading = true
  this.bookingService
    .getBookingInformation(Number(this.FlightId))
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => { // Changed from BookingData to any
        const bookingData = data as BookingData; // Type assertion
        this.id = bookingData.id
        this.bookingId = bookingData.bookingReference
        this.flightDetails = bookingData.flight
        this.travellerList = bookingData.passengers
        this.totalAmount = bookingData.totalAmount 
        this.isLoading = false

        // Animate content entrance
        setTimeout(() => {
          const element = document.querySelector(".confirmation-content")
          if (element) {
            element.classList.add("animate-in")
          }
        }, 100)
      },
      error: (err) => {
        console.error("Error loading booking information:", err)
        this.showToastMessage("error", "Failed to load booking information. Please try again.")
        this.isLoading = false
      },
    })
}
  // Helper methods for labels
  getSeatClassLabel(value: number): string {
    const seatClassMap: Record<number, string> = {
      [SeatClass.Economy]: "Economy",
      [SeatClass.Business]: "Business",
    }
    return seatClassMap[value] || "Economy"
  }

  getGenderLabel(value: number): string {
    const genderMap: Record<number, string> = {
      [Gender.Male]: "Male",
      [Gender.Female]: "Female",
    }
    return genderMap[value] || "Male"
  }

  // Utility methods
  calculateTotalFare(): number {
    return this.totalAmount
  }

  calculateFlightDuration(): string {
    if (!this.flightDetails?.departureDateTime || !this.flightDetails?.arrivalDateTime) {
      return "N/A"
    }

    const departure = new Date(this.flightDetails.departureDateTime)
    const arrival = new Date(this.flightDetails.arrivalDateTime)
    const durationMs = arrival.getTime() - departure.getTime()

    if (durationMs <= 0) return "N/A"

    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  getCurrentDate(): Date {
    return new Date()
  }

  getOriginCity(): string {
    return this.flightDetails?.origin || "N/A"
  }

  getDestinationCity(): string {
    return this.flightDetails?.destination || "N/A"
  }

  // Passenger management methods
  editPassenger(traveller: Passenger, index: number): void {
    this.travellerForm.patchValue({
      id: traveller.id,
      firstName: traveller.firstName,
      lastName: traveller.lastName,
      age: traveller.age,
      gender: this.getGenderLabel(traveller.gender),
      seatClass: this.getSeatClassLabel(traveller.seatClass),
    })

    this.isEditing = true
    this.editIndex = index
  }

  updatePassenger(): void {
    if (this.travellerForm.invalid) {
      this.markFormGroupTouched(this.travellerForm)
      this.showToastMessage("error", "Please fill in all required fields correctly.")
      return
    }

    this.isUpdating = true

    const formValue = this.travellerForm.value
    const genderValue = formValue.gender
    const seatClassValue = formValue.seatClass

    // Convert gender and seatClass to correct enum format
    const formattedGender = genderValue === "Male" ? Gender.Male : Gender.Female
    const formattedSeatClass = seatClassValue === "Economy" ? SeatClass.Economy : SeatClass.Business

    const updatedPassenger: Passenger = {
      id: formValue.id,
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      age: Number.parseInt(formValue.age),
      gender: formattedGender,
      seatClass: formattedSeatClass,
    }

    this.bookingService
      .updatePassenger(this.FlightId, updatedPassenger)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToastMessage("success", "Passenger updated successfully!")

          // Update the local list
          const passengerIndex = this.travellerList.findIndex((p) => p.id === updatedPassenger.id)
          if (passengerIndex !== -1) {
            this.travellerList[passengerIndex] = { ...this.travellerList[passengerIndex], ...updatedPassenger }
          }

          this.cancelEdit()
        },
        error: (err) => {
          console.error("Error updating passenger:", err)
          this.showToastMessage("error", "Failed to update passenger. Please try again.")
          this.isUpdating = false
        },
      })
  }

  cancelEdit(): void {
    this.isEditing = false
    this.isUpdating = false
    this.editIndex = -1
    this.travellerForm.reset({
      seatClass: "Economy",
    })
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key)
      control?.markAsTouched()
    })
  }

  // Payment and actions
  proceedToPayment(): void {
    if (!this.bookingId || !this.totalAmount) {
      this.showToastMessage("error", "Booking information is incomplete")
      return
    }

    Swal.fire({
      title: "Proceed to Payment?",
      html: `
        <div style="text-align: left; margin: 1rem 0;">
          <p><strong>Booking Reference:</strong> ${this.bookingId}</p>
          <p><strong>Total Amount:</strong> $${this.totalAmount}</p>
          <p><strong>Passengers:</strong> ${this.travellerList.length}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#667eea",
      cancelButtonColor: "#718096",
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal-popup-custom",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProcessingPayment = true

        // Simulate processing delay
        setTimeout(() => {
          this.router.navigate(["/payment", this.id])
          this.isProcessingPayment = false
        }, 2000)
      }
    })
  }

  // Additional action methods
  async copyBookingId(): Promise<void> {
    if (!this.bookingId) {
      this.showToastMessage("error", "No booking reference to copy")
      return
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this.bookingId)
        this.showToastMessage("success", "Booking reference copied to clipboard!")
      } else {
        // Fallback for older browsers
        this.fallbackCopyToClipboard(this.bookingId)
        this.showToastMessage("success", "Booking reference copied to clipboard!")
      }
    } catch (err) {
      console.error("Failed to copy:", err)
      this.showToastMessage("error", "Failed to copy booking reference")
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand("copy")
    } catch (err) {
      console.error("Fallback: Unable to copy", err)
    }

    document.body.removeChild(textArea)
  }

  downloadTicket(): void {
    this.showToastMessage("info", "Preparing your e-ticket...")

    // Simulate download process
    setTimeout(() => {
      this.showToastMessage("success", "E-ticket downloaded successfully!")
    }, 2000)
  }

  async shareBooking(): Promise<void> {
    const shareData = {
      title: "Flight Booking Confirmation",
      text: `Booking Reference: ${this.bookingId} - Flight ${this.flightDetails?.flightNumber}`,
      url: window.location.href,
    }

    if (navigator.share && "canShare" in navigator) {
      try {
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData)
          this.showToastMessage("success", "Booking details shared successfully!")
        } else {
          this.fallbackShare()
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          this.fallbackShare()
        }
      }
    } else if (navigator.share) {
      try {
        await navigator.share(shareData)
        this.showToastMessage("success", "Booking details shared successfully!")
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          this.fallbackShare()
        }
      }
    } else {
      this.fallbackShare()
    }
  }

  private async fallbackShare(): Promise<void> {
    const url = window.location.href
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        this.showToastMessage("success", "Booking link copied to clipboard!")
      } else {
        this.fallbackCopyToClipboard(url)
        this.showToastMessage("success", "Booking link copied to clipboard!")
      }
    } catch (err) {
      this.showToastMessage("info", "Share link: " + url)
    }
  }

  addToCalendar(): void {
    if (!this.flightDetails) {
      this.showToastMessage("error", "Flight details not available.")
      return
    }

    try {
      const startDate = new Date(this.flightDetails.departureDateTime)
      const endDate = new Date(this.flightDetails.arrivalDateTime)

      const calendarEvent = {
        title: `Flight ${this.flightDetails.flightNumber} - ${this.flightDetails.origin} to ${this.flightDetails.destination}`,
        start: startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
        end: endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
        description: `Booking Reference: ${this.bookingId}`,
      }

      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        calendarEvent.title,
      )}&dates=${calendarEvent.start}/${calendarEvent.end}&details=${encodeURIComponent(calendarEvent.description)}`

      window.open(calendarUrl, "_blank")
      this.showToastMessage("success", "Opening calendar to add your flight!")
    } catch (error) {
      console.error("Calendar error:", error)
      this.showToastMessage("error", "Failed to add to calendar")
    }
  }

  // Toast methods
  private showToastMessage(type: "success" | "error" | "info", message: string): void {
    this.toastType = type
    this.toastMessage = message
    this.toastIcon = this.getToastIcon(type)
    this.showToast = true

    // Auto hide after 4 seconds
    setTimeout(() => {
      this.hideToast()
    }, 4000)
  }

  private getToastIcon(type: string): string {
    switch (type) {
      case "success":
        return "fas fa-check-circle"
      case "error":
        return "fas fa-exclamation-circle"
      case "info":
        return "fas fa-info-circle"
      default:
        return "fas fa-bell"
    }
  }

  hideToast(): void {
    this.showToast = false
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.travellerForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} is required`
      if (field.errors["minlength"]) return `${fieldName} is too short`
      if (field.errors["min"]) return `Age must be at least 1`
      if (field.errors["max"]) return `Age must be less than 120`
    }
    return ""
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.travellerForm.get(fieldName)
    return !!(field?.invalid && field.touched)
  }

  // Utility methods for template
  trackByPassengerId(index: number, passenger: Passenger): number {
    return passenger.id
  }

  // Method to handle modal clicks (prevent propagation)
  stopPropagation(event: Event): void {
    event.stopPropagation()
  }

  // Method to handle canceling edit when backdrop is clicked
  onBackdropClick(): void {
    if (this.isEditing) {
      this.cancelEdit()
    }
  }
}
