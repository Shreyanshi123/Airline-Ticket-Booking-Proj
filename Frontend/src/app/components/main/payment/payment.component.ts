import { CommonModule } from "@angular/common"
import { Component, type OnInit, inject } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { BookingService } from "../../../services/booking.service"
import { ActivatedRoute } from "@angular/router"
import { AuthService } from "../../../services/auth.service"
import { PaymentService } from "../../../services/payment.service"
import { trigger, style, transition, animate } from "@angular/animations"

interface PaymentData {
  cardHolderName: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

interface Month {
  value: string
  label: string
}

@Component({
  selector: "app-payment",
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
  animations: [
    trigger("slideInUp", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(30px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
    trigger("fadeIn", [
      transition(":enter", [style({ opacity: 0 }), animate("300ms ease-out", style({ opacity: 1 }))]),
    ]),
    trigger("slideDown", [
      transition(":enter", [
        style({ maxHeight: "0", opacity: 0 }),
        animate("300ms ease-out", style({ maxHeight: "100px", opacity: 1 })),
      ]),
      transition(":leave", [animate("300ms ease-out", style({ maxHeight: "0", opacity: 0 }))]),
    ]),
  ],
})
export class PaymentComponent implements OnInit {
  // Services
  bookingService = inject(BookingService)
  authService = inject(AuthService)
  route = inject(ActivatedRoute)
  paymentService = inject(PaymentService)

  // Component state
  totalAmount = 0
  selectedPaymentMethod = ""
  reservationId = ""
  bookingInfo: any
  userInfo: any
  isProcessing = false
  isFormValid = false
  processingStep = 0

  // Form data
  paymentData: PaymentData = {
    cardHolderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  }

  // Card options
  storeCard = false
  useSavedCard = false
  hasSavedCard = false
  savedCardLast4 = ""
  savedCardType = ""

  // UI state
  showCvvTooltip = false
  detectedCardType = ""
  showPromoCode = false
  promoCode = ""
  hasDiscount = false
  discountAmount = 0

  // Form options
  months: Month[] = [
    { value: "01", label: "01 - January" },
    { value: "02", label: "02 - February" },
    { value: "03", label: "03 - March" },
    { value: "04", label: "04 - April" },
    { value: "05", label: "05 - May" },
    { value: "06", label: "06 - June" },
    { value: "07", label: "07 - July" },
    { value: "08", label: "08 - August" },
    { value: "09", label: "09 - September" },
    { value: "10", label: "10 - October" },
    { value: "11", label: "11 - November" },
    { value: "12", label: "12 - December" },
  ]

  years: number[] = []

  constructor(private router: Router) {
    // Generate years array (current year + 20 years)
    const currentYear = new Date().getFullYear()
    for (let i = 0; i < 21; i++) {
      this.years.push(currentYear + i)
    }
  }

  ngOnInit(): void {
     window.scrollTo(0, 0); // Scrolls to the top of the page
    this.initializeComponent()
  }

  private initializeComponent(): void {
    // Extract reservation ID from route
    this.route.params.subscribe((params) => {
      this.reservationId = params["reservationId"]
      console.log("Extracted Reservation ID:", this.reservationId)
    })

    // Get user information
    this.userInfo = this.authService.getUserData()
    if (this.userInfo?.user) {
      this.userInfo = this.userInfo.user
      this.prefillUserData()
    }

    // Check for saved card
    this.checkSavedCard()

    // Load booking information
    this.loadBookingInfo()
  }

  private prefillUserData(): void {
    this.paymentData.cardHolderName = `${this.userInfo?.firstName || ""} ${this.userInfo?.lastName || ""}`.trim()
  }

  private checkSavedCard(): void {
    const savedCard = JSON.parse(localStorage.getItem("savedCard") || "{}")
    if (savedCard.cardNumber) {
      this.hasSavedCard = true
      this.savedCardLast4 = savedCard.cardNumber.slice(-4)
      this.savedCardType = this.detectCardType(savedCard.cardNumber)

      // Optionally pre-fill with saved card data
      if (savedCard.cardHolder) {
        this.paymentData.cardHolderName = savedCard.cardHolder
        this.paymentData.expiryMonth = savedCard.expiryMonth
        this.paymentData.expiryYear = savedCard.expiryYear
      }
    }
  }

  private loadBookingInfo(): void {
    // Fixed: Convert string to number for the service call
    const reservationIdNumber = parseInt(this.reservationId, 10)
    if (isNaN(reservationIdNumber)) {
      console.error("Invalid reservation ID:", this.reservationId)
      this.showErrorMessage("Invalid reservation ID")
      return
    }

    this.bookingService.getBookingInformation(reservationIdNumber).subscribe({
      next: (data: any) => {
        this.bookingInfo = data
        this.totalAmount = data.totalAmount
        console.log("Booking Info:", this.bookingInfo)
      },
      error: (err) => {
        console.error("Error fetching booking info:", err)
        this.showErrorMessage("Failed to load booking information")
      },
    })
  }

  onPaymentMethodChange(): void {
    this.validateForm()
    // Add animation or visual feedback here
    setTimeout(() => {
      this.validateForm()
    }, 100)
  }

  onUseSavedCardChange(): void {
    if (this.useSavedCard) {
      const savedCard = JSON.parse(localStorage.getItem("savedCard") || "{}")
      this.paymentData.cardNumber = savedCard.cardNumber || ""
      this.paymentData.expiryMonth = savedCard.expiryMonth || ""
      this.paymentData.expiryYear = savedCard.expiryYear || ""
      this.paymentData.cvv = "" // Always require CVV for security
    }
    this.validateForm()
  }

  formatCardNumber(event: any): void {
    const value = event.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value

    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substring(0, 19)
    }

    event.target.value = formattedValue
    this.paymentData.cardNumber = formattedValue

    // Detect card type
    this.detectedCardType = this.detectCardType(value)
  }

  onCardNumberKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode
    // Allow only numbers and spaces
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 32) {
      return false
    }
    return true
  }

  onCvvKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode
    // Allow only numbers
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }

  private detectCardType(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, "")

    if (/^4/.test(number)) {
      return "visa"
    } else if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) {
      return "mastercard"
    } else if (/^3[47]/.test(number)) {
      return "amex"
    }

    return ""
  }

  validateForm(): void {
    if (!this.selectedPaymentMethod) {
      this.isFormValid = false
      return
    }

    if (this.useSavedCard) {
      this.isFormValid = !!this.paymentData.cvv
      return
    }

    const isValid = !!(
      this.paymentData.cardHolderName &&
      this.paymentData.cardNumber &&
      this.paymentData.expiryMonth &&
      this.paymentData.expiryYear &&
      this.paymentData.cvv
    )

    this.isFormValid = isValid
  }

  togglePromoCode(): void {
    this.showPromoCode = !this.showPromoCode
  }

  applyPromoCode(): void {
    if (!this.promoCode) return

    // Simulate promo code validation
    const validPromoCodes = ["SAVE10", "WELCOME20", "FLIGHT15"]

    if (validPromoCodes.includes(this.promoCode.toUpperCase())) {
      this.hasDiscount = true
      this.discountAmount = this.totalAmount * 0.1 // 10% discount
      this.totalAmount -= this.discountAmount
      this.showSuccessMessage("Promo code applied successfully!")
    } else {
      this.showErrorMessage("Invalid promo code")
    }
  }

  processPayment(): void {
    if (!this.isFormValid || this.isProcessing) return

    this.isProcessing = true
    this.processingStep = 0

    // Simulate processing steps
    const steps = [
      { step: 1, delay: 1000, message: "Validating card details" },
      { step: 2, delay: 1500, message: "Contacting bank" },
      { step: 3, delay: 2000, message: "Confirming payment" },
    ]

    steps.forEach((stepInfo, index) => {
      setTimeout(() => {
        this.processingStep = stepInfo.step

        if (index === steps.length - 1) {
          // Final step - make actual payment
          this.makePayment()
        }
      }, stepInfo.delay)
    })
  }

  private makePayment(): void {
    const paymentMethodMap: Record<string, number> = {
      "Credit Card": 0,
      "Debit Card": 1,
    }

    const paymentPayload = {
      reservationId: this.reservationId,
      paymentMethod: paymentMethodMap[this.selectedPaymentMethod],
      cardHolderName: this.paymentData.cardHolderName,
      cardNumber: this.paymentData.cardNumber.replace(/\s/g, ""),
      expiryMonth: this.paymentData.expiryMonth,
      expiryYear: this.paymentData.expiryYear,
      cvv: this.paymentData.cvv,
    }

    // Save card if requested
    if (this.storeCard && !this.useSavedCard) {
      this.saveCardToStorage()
    }

    // Fixed: Convert string to number for the service call
    const reservationIdNumber = parseInt(this.reservationId, 10)
    if (isNaN(reservationIdNumber)) {
      this.isProcessing = false
      this.showErrorMessage("Invalid reservation ID")
      return
    }

    this.paymentService.paymentForTickets(reservationIdNumber, paymentPayload).subscribe({
      next: (data: any) => {
        this.isProcessing = false

        if (data.status === "Failed") {
          this.showErrorMessage("Payment failed. Please try again.")
        } else {
          this.showSuccessMessage(`Payment successful via ${this.selectedPaymentMethod}`)
          setTimeout(() => {
            this.router.navigate(["/payment-success", this.reservationId])
          }, 2000)
        }
      },
      error: (err) => {
        this.isProcessing = false

        if (err.status === 400) {
          this.showErrorMessage("Payment already completed. You cannot pay twice.")
        } else {
          this.showErrorMessage("Payment failed. Please try again.")
        }
        console.error("Error processing payment:", err)
      },
    })
  }

  private saveCardToStorage(): void {
    const maskedCardNumber = `**** **** **** ${this.paymentData.cardNumber.slice(-4)}`
    const storedCard = {
      cardHolder: this.paymentData.cardHolderName,
      cardNumber: maskedCardNumber,
      expiryMonth: this.paymentData.expiryMonth,
      expiryYear: this.paymentData.expiryYear,
    }
    localStorage.setItem("savedCard", JSON.stringify(storedCard))
    console.log("Card saved in localStorage:", storedCard)
  }

  // Utility methods for template
  getDepartureAirportName(): string {
    const airportNames: Record<string, string> = {
      JFK: "John F. Kennedy International",
      LAX: "Los Angeles International",
      LHR: "London Heathrow",
      CDG: "Charles de Gaulle",
      NRT: "Narita International",
      DXB: "Dubai International",
    }
    return airportNames[this.bookingInfo?.departureAirport] || "Unknown Airport"
  }

  getArrivalAirportName(): string {
    const airportNames: Record<string, string> = {
      JFK: "John F. Kennedy International",
      LAX: "Los Angeles International",
      LHR: "London Heathrow",
      CDG: "Charles de Gaulle",
      NRT: "Narita International",
      DXB: "Dubai International",
    }
    return airportNames[this.bookingInfo?.arrivalAirport] || "Unknown Airport"
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  calculateBaseFare(): number {
    if (!this.totalAmount) return 0
    return Math.round(this.totalAmount * 0.85 * 100) / 100
  }

  calculateTaxes(): number {
    if (!this.totalAmount) return 0
    return Math.round(this.totalAmount * 0.15 * 100) / 100
  }

  private showSuccessMessage(message: string): void {
    // Implement toast notification or modal
    console.log("Success:", message)
    // You can integrate with a toast service here
  }

  private showErrorMessage(message: string): void {
    // Implement toast notification or modal
    console.error("Error:", message)
    alert(message) // Temporary - replace with proper notification
  }
}
