import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FAQ {
  question: string
  answer: string
  isOpen: boolean
}

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.css",
})
export class ContactComponent implements OnInit {
  formData: ContactForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  }

  isSubmitting = false
  showSuccessMessage = false

  faqs: FAQ[] = [
    {
      question: "How can I cancel or modify my booking?",
      answer:
        "You can cancel or modify your booking through your account dashboard or by contacting our customer support team. Cancellation policies vary by airline and fare type.",
      isOpen: false,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All transactions are secured with SSL encryption.",
      isOpen: false,
    },
    {
      question: "Do you offer travel insurance?",
      answer:
        "Yes, we partner with leading insurance providers to offer comprehensive travel insurance options. You can add insurance during the booking process or contact us for more information.",
      isOpen: false,
    },
    {
      question: "How far in advance can I book flights?",
      answer:
        "You can typically book flights up to 11 months in advance, though this varies by airline. We recommend booking 2-8 weeks in advance for the best deals on domestic flights.",
      isOpen: false,
    },
    {
      question: "What if my flight is delayed or cancelled?",
      answer:
        "If your flight is delayed or cancelled, we'll help you rebook on the next available flight at no extra cost. You may also be entitled to compensation depending on the circumstances.",
      isOpen: false,
    },
  ]

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo(0, 0)
  }

  onSubmit(): void {
    if (this.isSubmitting) return

    this.isSubmitting = true

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false
      this.showSuccessMessage = true
      this.resetForm()
    }, 2000)
  }

  resetForm(): void {
    this.formData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    }
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen
  }

  startLiveChat(): void {
    // Implement live chat functionality
    console.log("Starting live chat...")
    alert("Live chat feature coming soon!")
  }

  getDirections(): void {
    // Open Google Maps or similar
    const address = "123 Travel Street, New York, NY 10001"
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(url, "_blank")
  }

  closeSuccessMessage(): void {
    this.showSuccessMessage = false
  }
}
