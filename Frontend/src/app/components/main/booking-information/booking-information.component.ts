import { Component, inject, type OnInit, type OnDestroy } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { BookingService } from "../../../services/booking.service"
import { CommonModule } from "@angular/common"
import { Subject, takeUntil, interval } from "rxjs"
import Swal from "sweetalert2"

enum PaymentMethod {
  CreditCard = 0,
  DebitCard = 1,
}

enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
}

enum SeatClass {
  Economy = 0,
  Business = 1,
}

interface BookingData {
  bookingReference: string
  status: number
  expiresAt: Date | null
  flight: {
    flightNumber: string
    origin: string
    destination: string
    departureDateTime: string
    arrivalDateTime: string
  }
  payment: {
    paymentMethod: string
    status: string
  }
  passengers: Array<{
    firstName: string
    lastName: string
    seatClass: string
  }>
  canCancel: boolean
  refundAmount?: number
  totalAmount?: number
  bookingDate?: string
}

@Component({
  selector: "app-booking-information",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./booking-information.component.html",
  styleUrls: ["./booking-information.component.css"],
})
export class BookingInformationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()
  private countdownInterval$ = new Subject<void>()

  // Services
  private bookingService = inject(BookingService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  // Data properties
  bookingId!: number
  bookingData: BookingData | null = null

  // UI state properties
  isProcessing = false
  showToast = false
  toastMessage = ""
  toastType = "success"
  toastIcon = "fas fa-check-circle"
  isLoading = true

  // Countdown properties
  countdownMinutes = 0
  countdownSeconds = 0

  ngOnInit(): void {
     window.scrollTo(0, 0); // Scrolls to the top of the page
    const idParam = this.route.snapshot.paramMap.get("id")
    if (idParam) {
      this.bookingId = Number(idParam)
      this.fetchBookingDetails()
    } else {
      this.showToastMessage("error", "Invalid booking ID")
      this.router.navigate(["/booking-history"])
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.countdownInterval$.next()
    this.countdownInterval$.complete()
  }

  fetchBookingDetails(): void {
    this.isLoading = true
    
    // Simulate loading time for better UX
    setTimeout(() => {
      this.bookingService
        .getBookingInformation(this.bookingId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            console.log("Booking Details:", data)
            
            try {
              const departureTime = new Date(data.flight?.departureDateTime)
              const currentTime = new Date()
              const hoursUntilDeparture = (departureTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60)

              this.bookingData = {
                ...data,
                status: data.status ?? 0,
                expiresAt: data.expiresAt ? new Date(data.expiresAt + "Z") : null,
                payment: {
                  paymentMethod: this.getPaymentMethod(data.payment?.paymentMethod ?? -1),
                  status: this.getPaymentStatus(data.payment?.status ?? -1),
                },
                passengers:
                  data.passengers?.map((passenger: { firstName: string; lastName: string; seatClass: number }) => ({
                    ...passenger,
                    seatClass: this.getSeatClass(passenger.seatClass ?? -1),
                  })) ?? [],
                canCancel: data.status === 1 && hoursUntilDeparture > 24,
                totalAmount: data.totalAmount || 0,
                bookingDate: data.bookingDate || new Date().toISOString(),
              }

              // Start countdown if booking is pending
              if (this.bookingData?.status === 0 && this.bookingData.expiresAt) {
                this.startCountdown()
              }
              
              this.isLoading = false
            } catch (error) {
              console.error("Error processing booking data:", error)
              this.showToastMessage("error", "Error processing booking data")
              this.isLoading = false
            }
          },
          error: (err) => {
            console.error("Error fetching booking details:", err)
            this.showToastMessage("error", "Failed to load booking details. Please try again.")
            this.isLoading = false
          },
        })
    }, 1500) // Simulated loading time
  }

  private startCountdown(): void {
    interval(1000)
      .pipe(takeUntil(this.countdownInterval$), takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateCountdown()
      })
  }

  private updateCountdown(): void {
    if (!this.bookingData?.expiresAt) return

    const now = new Date()
    const timeLeft = this.bookingData.expiresAt.getTime() - now.getTime()

    if (timeLeft <= 0) {
      this.countdownMinutes = 0
      this.countdownSeconds = 0
      if (this.bookingData) {
        this.bookingData.status = 2 // Expired
      }
      this.countdownInterval$.next()
      return
    }

    this.countdownMinutes = Math.floor(timeLeft / 60000)
    this.countdownSeconds = Math.floor((timeLeft % 60000) / 1000)
  }

  // Status helper methods
  getStatusClass(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: "pending",
      1: "confirmed", 
      2: "cancelled",
      3: "refunded"
    }
    return statusMap[status] || "pending"
  }

  getStatusIcon(status: number): string {
    const iconMap: { [key: number]: string } = {
      0: "fas fa-clock",
      1: "fas fa-check-circle",
      2: "fas fa-times-circle", 
      3: "fas fa-undo"
    }
    return iconMap[status] || "fas fa-question-circle"
  }

  getStatusTitle(status: number): string {
    const titleMap: { [key: number]: string } = {
      0: "Booking Pending",
      1: "Booking Confirmed",
      2: "Booking Cancelled",
      3: "Booking Refunded"
    }
    return titleMap[status] || "Unknown Status"
  }

  getStatusDescription(status: number): string {
    const descriptionMap: { [key: number]: string } = {
      0: "Your booking is pending payment. Please complete payment to confirm your reservation.",
      1: "Your booking has been confirmed. You're all set for your journey!",
      2: "This booking has been cancelled. If you need assistance, please contact support.",
      3: "This booking has been refunded. The amount will be credited to your account."
    }
    return descriptionMap[status] || "Status information is not available."
  }

  // Payment helper methods
  getPaymentMethod(value: number): string {
    if (value in PaymentMethod) {
      return PaymentMethod[value]
    }
    return "Not Provided"
  }

  getPaymentStatus(value: number): string {
    if (value in PaymentStatus) {
      return PaymentStatus[value]
    }
    return "Pending"
  }

  getPaymentStatusClass(status: string): string {
    const statusClassMap: { [key: string]: string } = {
      'completed': 'completed',
      'pending': 'pending', 
      'failed': 'failed',
      'refunded': 'refunded'
    }
    return statusClassMap[status.toLowerCase()] || 'pending'
  }

  getPaymentStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'completed': 'fas fa-check-circle',
      'pending': 'fas fa-clock',
      'failed': 'fas fa-times-circle',
      'refunded': 'fas fa-undo'
    }
    return iconMap[status.toLowerCase()] || 'fas fa-question-circle'
  }

  getPaymentMethodIcon(method: string): string {
    const iconMap: { [key: string]: string } = {
      'creditcard': 'fas fa-credit-card',
      'debitcard': 'fas fa-credit-card'
    }
    return iconMap[method.toLowerCase()] || 'fas fa-money-bill'
  }

  getPaymentDescription(method: string): string {
    const descriptionMap: { [key: string]: string } = {
      'creditcard': 'Secure credit card payment',
      'debitcard': 'Direct debit card payment'
    }
    return descriptionMap[method.toLowerCase()] || 'Payment method'
  }

  getSeatClass(value: number): string {
    if (value in SeatClass) {
      return SeatClass[value]
    }
    return "Unknown"
  }

  // Countdown helper methods
  getCountdownMinutes(): string {
    return this.countdownMinutes.toString().padStart(2, "0")
  }

  getCountdownSeconds(): string {
    return this.countdownSeconds.toString().padStart(2, "0")
  }

  // Utility methods
  calculateFlightDuration(): string {
    if (!this.bookingData?.flight?.departureDateTime || !this.bookingData?.flight?.arrivalDateTime) {
      return "N/A"
    }

    try {
      const departure = new Date(this.bookingData.flight.departureDateTime)
      const arrival = new Date(this.bookingData.flight.arrivalDateTime)
      
      if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
        return "N/A"
      }
      
      const durationMs = arrival.getTime() - departure.getTime()
      const hours = Math.floor(durationMs / (1000 * 60 * 60))
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

      return `${hours}h ${minutes}m`
    } catch (error) {
      console.error("Error calculating flight duration:", error)
      return "N/A"
    }
  }

  getCancellationPolicy(): string {
    if (!this.bookingData?.canCancel) {
      return "Non-refundable"
    }
    return "Free cancellation up to 24 hours before departure"
  }

  // Action methods
  copyReference(): void {
    if (!this.bookingData?.bookingReference) return

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(this.bookingData.bookingReference)
        .then(() => {
          this.showToastMessage("success", "Booking reference copied to clipboard!")
        })
        .catch(() => {
          this.fallbackCopy(this.bookingData!.bookingReference)
        })
    } else {
      this.fallbackCopy(this.bookingData.bookingReference)
    }
  }

  private fallbackCopy(text: string): void {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      this.showToastMessage("success", "Booking reference copied to clipboard!")
    } catch (err) {
      this.showToastMessage("error", "Failed to copy reference. Please try again.")
    }
    document.body.removeChild(textArea)
  }

  cancelReservation(): void {
    if (!this.bookingData) return

    Swal.fire({
      title: "Cancel Reservation?",
      html: `
        <div style="text-align: left; margin: 1rem 0;">
          <p>Are you sure you want to cancel this reservation?</p>
          <p><strong>Booking Reference:</strong> ${this.bookingData.bookingReference}</p>
          <p><strong>Flight:</strong> ${this.bookingData.flight.flightNumber}</p>
          <p style="color: #e53e3e; font-weight: 500;">This action cannot be undone.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#718096",
      confirmButtonText: "Yes, Cancel Booking",
      cancelButtonText: "Keep Booking",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProcessing = true

        this.bookingService
          .cancelReservation(this.bookingId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: any) => {
              console.log("Backend Response:", res)

              if (res?.refundAmount && res.refundAmount > 0) {
                this.showToastMessage(
                  "success",
                  `Reservation cancelled successfully. Refund Amount: $${res.refundAmount}`,
                )
                if (this.bookingData) {
                  this.bookingData.status = 3
                  this.bookingData.refundAmount = res.refundAmount
                }
              } else {
                this.showToastMessage("info", "Reservation cancelled successfully. No refund is applicable.")
                if (this.bookingData) {
                  this.bookingData.status = 2
                }
              }

              this.fetchBookingDetails()
              this.isProcessing = false
            },
            error: (err) => {
              const errorMessage = err?.error?.message || err?.message || "Cancellation failed. Please try again."
              this.showToastMessage("error", errorMessage)
              console.error("Error cancelling reservation:", err)
              this.isProcessing = false
            },
          })
      }
    })
  }

  proceedToPayment(): void {
    if (!this.bookingData) return

    this.isProcessing = true
    console.log("Proceeding to payment for booking ID:", this.bookingId)

    setTimeout(() => {
      this.router.navigate(["/payment", this.bookingId]).catch(err => {
        console.error("Navigation error:", err)
        this.showToastMessage("error", "Navigation failed. Please try again.")
      })
      this.isProcessing = false
    }, 1000)
  }

  downloadTicket(): void {
    if (!this.bookingData) return

    this.showToastMessage("info", "Downloading your ticket...")

    setTimeout(() => {
      this.showToastMessage("success", "Ticket downloaded successfully!")
    }, 2000)
  }

  shareBooking(): void {
    if (!this.bookingData) return

    const shareData = {
      title: "Flight Booking Details",
      text: `Booking Reference: ${this.bookingData.bookingReference} - Flight ${this.bookingData.flight.flightNumber}`,
      url: window.location.href,
    }

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          this.showToastMessage("success", "Booking details shared successfully!")
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          this.fallbackShare()
        })
    } else {
      this.fallbackShare()
    }
  }

  private fallbackShare(): void {
    const url = window.location.href
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          this.showToastMessage("success", "Booking link copied to clipboard!")
        })
        .catch(() => {
          this.showToastMessage("info", "Share link: " + url)
        })
    } else {
      this.showToastMessage("info", "Share link: " + url)
    }
  }

  openHelp(): void {
    Swal.fire({
      title: "Need Help?",
      html: `
        <div style="text-align: left; margin: 1rem 0;">
          <h4>Contact Support</h4>
          <p><strong>Phone:</strong> +1-800-SKYBOOK</p>
          <p><strong>Email:</strong> support@skybook.com</p>
          <p><strong>Live Chat:</strong> Available 24/7</p>
          <br>
          <h4>Common Questions</h4>
          <ul>
            <li>How to modify my booking?</li>
            <li>Cancellation policy</li>
            <li>Check-in procedures</li>
            <li>Baggage allowance</li>
          </ul>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#667eea",
      confirmButtonText: "Got it!",
    })
  }

  goBack(): void {
    this.router.navigate(["/booking-history"]).catch(err => {
      console.error("Navigation error:", err)
    })
  }

  // Toast methods
  private showToastMessage(type: "success" | "error" | "info", message: string): void {
    this.toastType = type
    this.toastMessage = message
    this.toastIcon = this.getToastIcon(type)
    this.showToast = true

    setTimeout(() => {
      this.hideToast()
    }, 5000)
  }

  private getToastIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'success': 'fas fa-check-circle',
      'error': 'fas fa-exclamation-circle',
      'info': 'fas fa-info-circle'
    }
    return iconMap[type] || 'fas fa-bell'
  }

  hideToast(): void {
    this.showToast = false
  }
}