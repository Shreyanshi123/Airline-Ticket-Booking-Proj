import { CommonModule } from "@angular/common"
import { Component, Input, type OnInit } from "@angular/core"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface BarcodeLine {
  width: number
}

@Component({
  selector: "app-ticket",
  standalone: true,

  imports: [CommonModule],
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"],
})
export class TicketComponent implements OnInit {
  @Input() bookingInfo: any // ✅ Receive booking details from parent component
  @Input() flightInfo: any

  barcodeLines: BarcodeLine[] = []

  ngOnInit(): void {
    this.generateBarcode()
  }

  /**
   * Generate barcode lines for visual effect
   */
  generateBarcode(): void {
    const lineCount = 60
    this.barcodeLines = []

    for (let i = 0; i < lineCount; i++) {
      // Generate random width between 1 and 4 pixels
      const width = Math.floor(Math.random() * 4) + 1
      this.barcodeLines.push({ width })
    }
  }

  /**
   * Get seat class label from numeric value
   */
  getSeatClassLabel(value: number): string {
    const seatClassMap: Record<number, string> = {
      0: "Economy Class",
      1: "Business Class",
      2: "First Class",
    }
    return seatClassMap[value] || "Economy Class" // Handle unexpected values
  }

  /**
   * Extract airport code from full airport name
   */
  getAirportCode(airportName: string): string {
    if (!airportName) return "N/A"

    // Common airport mappings
    const airportCodes: Record<string, string> = {
      "New York": "JFK",
      "Los Angeles": "LAX",
      London: "LHR",
      Paris: "CDG",
      Tokyo: "NRT",
      Dubai: "DXB",
      Mumbai: "BOM",
      Delhi: "DEL",
      Bangalore: "BLR",
      Chennai: "MAA",
      Kolkata: "CCU",
      Hyderabad: "HYD",
    }

    // Check if the airport name contains a known city
    for (const [city, code] of Object.entries(airportCodes)) {
      if (airportName.toLowerCase().includes(city.toLowerCase())) {
        return code
      }
    }

    // If no match found, try to extract first 3 letters
    const words = airportName.split(" ")
    if (words.length > 0) {
      return words[0].substring(0, 3).toUpperCase()
    }

    return "N/A"
  }

  /**
   * Calculate flight duration between departure and arrival
   */
  calculateFlightDuration(): string {
    if (!this.flightInfo?.departureDateTime || !this.flightInfo?.arrivalDateTime) {
      return "2h 30m"
    }

    const departure = new Date(this.flightInfo.departureDateTime)
    const arrival = new Date(this.flightInfo.arrivalDateTime)
    const durationMs = arrival.getTime() - departure.getTime()

    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  /**
   * Generate seat number for passenger
   */
  generateSeatNumber(passengerIndex: number): string {
    const rows = ["12", "13", "14", "15", "16", "17", "18", "19", "20"]
    const seats = ["A", "B", "C", "D", "E", "F"]

    const rowIndex = Math.floor(passengerIndex / 6)
    const seatIndex = passengerIndex % 6

    const row = rows[rowIndex] || "14"
    const seat = seats[seatIndex] || "A"

    return `${row}${seat}`
  }

  /**
   * Generate PDF of the ticket
   */
  generatePDF(): void {
    const ticketElement = document.getElementById("ticketContainer")
    if (!ticketElement) {
      console.error("Ticket container not found!")
      return
    }

    // Show loading state
    const button = document.querySelector(".download-btn") as HTMLButtonElement
    const originalText = button.innerHTML
    button.innerHTML = `
      <svg style="width: 20px; height: 20px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2"/>
      </svg>
      Generating PDF...
    `
    button.disabled = true

    html2canvas(ticketElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF("p", "mm", "a4")

        // Calculate dimensions to fit the page
        const imgWidth = 190
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Center the image on the page
        const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2
        const y = 10

        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)

        // Generate filename with booking reference
        const filename = `flight_ticket_${this.bookingInfo?.bookingReference || "AR123456"}.pdf`
        pdf.save(filename)

        // Reset button
        button.innerHTML = originalText
        button.disabled = false
      })
      .catch((error) => {
        console.error("Error generating PDF:", error)

        // Reset button on error
        button.innerHTML = originalText
        button.disabled = false

        alert("Error generating PDF. Please try again.")
      })
  }

  /**
   * Print the ticket
   */
  printTicket(): void {
    window.print() // ✅ Opens print dialog
  }
}
