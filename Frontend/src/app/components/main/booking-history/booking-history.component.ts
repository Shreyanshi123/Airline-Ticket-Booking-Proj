import { Component, inject, type OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Dropdown } from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css'],
})
export class BookingHistoryComponent implements OnInit {
  bookingService = inject(BookingService);
  router = inject(Router);

  bookingList: any[] = [];
  filteredBookingList: any[] = [];
  currentFilter = 'all';
  currentStatusFilter = 'all';
  isLoading = true;

  ngOnInit() {
     window.scrollTo(0, 0); // Scrolls to the top of the page
    this.checkExpiredReservations();
    this.fetchAllReservations();

    // Initialize Bootstrap dropdowns
    setTimeout(() => {
      document.querySelectorAll('.dropdown-toggle').forEach((dropdown) => {
        new Dropdown(dropdown);
      });
    }, 100);
  }

  checkExpiredReservations() {
    this.bookingService.checkExpiredReservations().subscribe({
      next: (res: any) => {
        console.log(res);
        console.log(`Expired reservations updated: ${res.updatedCount}`);
      },
      error: (err) => {
        console.error('Error checking expired reservations:', err);
      },
    });
  }

  setFilter(type: string) {
    this.currentFilter = type;
    this.filterBookings(type);
  }

  filterBookings(type: string) {
    const now = new Date();

    if (type === 'all') {
      this.filteredBookingList = [...this.bookingList];
    } else if (type === 'upcoming') {
      this.filteredBookingList = this.bookingList.filter(
        (booking) => new Date(booking.flight.departureDateTime) > now
      );
    } else if (type === 'past') {
      this.filteredBookingList = this.bookingList.filter(
        (booking) => new Date(booking.flight.departureDateTime) < now
      );
    }

    // Apply status filter if not 'all'
    if (this.currentStatusFilter !== 'all') {
      this.applyStatusFilter(this.currentStatusFilter);
    }

    console.log(`Filtered ${type} journeys:`, this.filteredBookingList);
  }

  filterByStatus(status: string) {
    this.currentStatusFilter = status;
    this.applyStatusFilter(status);
  }

  private applyStatusFilter(status: string) {
    if (status === 'all') {
      // Don't change filteredBookingList, keep current filter
      return;
    }

    this.filteredBookingList = this.filteredBookingList.filter((booking) => {
      return (
        (status === 'pending' && booking.status === 0) ||
        (status === 'confirmed' && booking.status === 1) ||
        (status === 'cancelled' && booking.status === 2) ||
        (status === 'refunded' && booking.status === 3)
      );
    });

    console.log(
      `Filtered reservations by status: ${status}`,
      this.filteredBookingList
    );

    // Force Angular to detect changes
    setTimeout(() => {}, 0);
  }

  fetchAllReservations() {
    this.isLoading = true;
    this.bookingService.getUserBookings().subscribe({
      next: (data: any) => {
        console.log('All Reservations:', data);
        this.bookingList = data.map((booking: any) => ({
          ...booking,
          returnReservationId: this.findReturnReservation(booking, data),
          isExpired: new Date(booking.expiresAt) < new Date(),
          bookingDate: booking.bookingDate
            ? new Date(booking.bookingDate)
            : 'N/A',
          flight: {
            ...booking.flight,
            departureDateTime: booking.flight.departureDateTime
              ? new Date(booking.flight.departureDateTime)
              : 'N/A',
            arrivalDateTime: booking.flight.arrivalDateTime
              ? new Date(booking.flight.arrivalDateTime)
              : 'N/A',
          },
          passengers: booking.passengers ?? [],
        }));
        this.filteredBookingList = [...this.bookingList];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.isLoading = false;
      },
    });
  }

  findReturnReservation(
    outboundBooking: any,
    allBookings: any[]
  ): number | undefined {
    if (!allBookings || allBookings.length === 0) {
      return undefined;
    }

    return (
      allBookings.find(
        (booking) =>
          booking.flight.origin === outboundBooking.flight.destination &&
          booking.flight.destination === outboundBooking.flight.origin &&
          new Date(booking.bookingDate) >
            new Date(outboundBooking.bookingDate) &&
          booking.passengers.length === outboundBooking.passengers.length
      )?.id || undefined
    );
  }

  // cancelRoundTrip(reservationId: number, returnReservationId?: number) {

  //   console.log("yash");
  //   Swal.fire({
  //     title: "Cancel Roundtrip?",
  //     text: "Are you sure you want to cancel both reservations?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Cancel Both",
  //     cancelButtonText: "No, Keep My Booking"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const cancelRequests = [this.bookingService.cancelReservation(reservationId)]
  //       if (returnReservationId) {
  //         cancelRequests.push(this.bookingService.cancelReservation(returnReservationId))
  //       }

  //       Promise.all(cancelRequests.map(req => req.toPromise())).then(() => {
  //         Swal.fire("Roundtrip Cancelled!", "Both tickets have been cancelled successfully.", "success")
  //         this.fetchAllReservations()
  //       }).catch((err) => {
  //         console.error("Error cancelling roundtrip:", err)
  //         Swal.fire("Cancellation Failed", "Could not cancel roundtrip booking.", "error")
  //       })
  //     }
  //   })
  // }

  cancelRoundTrip(reservationId: number, returnReservationId?: number) {
    Swal.fire({
      title: 'Cancel booking?',
      text: 'Are you sure you want to cancel reservation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep My Booking',
    }).then((result) => {
      if (result.isConfirmed) {
        const cancelRequests = [
          this.bookingService.cancelReservation(reservationId),
        ];
        if (returnReservationId) {
          cancelRequests.push(
            this.bookingService.cancelReservation(returnReservationId)
          );
          Promise.all(cancelRequests.map((req) => req.toPromise()))
            .then(() => {
              Swal.fire(
                'Roundtrip Cancelled!',
                'Both tickets have been cancelled successfully.',
                'success'
              );
              this.fetchAllReservations(); // ✅ Refresh UI after cancellation
            })
            .catch((err) => {
              console.error('Error cancelling roundtrip:', err);
              Swal.fire(
                'Cancellation Failed',
                'Could not cancel roundtrip booking.',
                'error'
              );
            });
        } else {
          Promise.all(cancelRequests.map((req) => req.toPromise()))
            .then(() => {
              Swal.fire(
                'Trip Cancelled!',
                'Ticket has been cancelled successfully.',
                'success'
              );
              this.fetchAllReservations(); // ✅ Refresh UI after cancellation
            })
            .catch((err) => {
              console.error('Error cancelling trip:', err);
              Swal.fire(
                'Cancellation Failed',
                'Could not cancel booking.',
                'error'
              );
            });
        }
      }
    });
  }

  payForRoundTrip(booking: any) {
    const returnReservationId = this.findReturnReservation(
      booking,
      this.bookingList
    );

    if (!returnReservationId && booking.status !== 0) {
      alert('Payment only available for pending reservations.');
      return;
    }

    Swal.fire({
      title: 'Proceed to Payment?',
      text: 'You are about to pay for your roundtrip booking.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/payment'], {
          queryParams: { reservationId: booking.id, returnReservationId },
        });
      }
    });
  }

  moreDetails(id: number) {
    console.log('Show more details logic here');
    this.router.navigate(['/booking-information', id]);
  }

  // Enhanced utility methods
  getStatusText(status: number): string {
    const statusMap: Record<number, string> = {
      0: 'Pending',
      1: 'Confirmed',
      2: 'Cancelled',
      3: 'Refunded',
    };
    return statusMap[status] || 'Unknown';
  }

  getAirportCode(cityName: string): string {
    const airportCodes: Record<string, string> = {
      'New York': 'NYC',
      'Los Angeles': 'LAX',
      Chicago: 'CHI',
      Miami: 'MIA',
      London: 'LHR',
      Paris: 'CDG',
      Tokyo: 'NRT',
      Dubai: 'DXB',
      Mumbai: 'BOM',
      Delhi: 'DEL',
      Bangalore: 'BLR',
      Chennai: 'MAA',
      Kolkata: 'CCU',
      Hyderabad: 'HYD',
    };

    return airportCodes[cityName] || cityName.substring(0, 3).toUpperCase();
  }

  calculateDuration(departure: Date, arrival: Date): string {
    if (!departure || !arrival) return 'N/A';

    const diff = new Date(arrival).getTime() - new Date(departure).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  getJourneyType(departureDate: Date): string {
    const now = new Date();
    return new Date(departureDate) > now ? 'Upcoming' : 'Completed';
  }

  getJourneyClass(departureDate: Date): string {
    const now = new Date();
    return new Date(departureDate) > now ? 'upcoming' : 'past';
  }

  getUpcomingCount(): number {
    const now = new Date();
    return this.bookingList.filter(
      (booking) => new Date(booking.flight.departureDateTime) > now
    ).length;
  }

  getPastCount(): number {
    const now = new Date();
    return this.bookingList.filter(
      (booking) => new Date(booking.flight.departureDateTime) < now
    ).length;
  }

  getUniqueDestinations(): number {
    const destinations = new Set();
    this.bookingList.forEach((booking) => {
      destinations.add(booking.flight.destination);
      destinations.add(booking.flight.origin);
    });
    return destinations.size;
  }

  trackByBookingId(index: number, booking: any): any {
    return booking.id;
  }

  navigateToBooking() {
    this.router.navigate(['/booking']);
  }

  // Additional utility methods for actions
  canPayForBooking(booking: any): boolean {
    return booking.status === 0; // Pending status
  }

  canCancelBooking(booking: any): boolean {
    return booking.status === 1; // Confirmed status
  }

  isRefunded(booking: any): boolean {
    return booking.status === 3; // Refunded status
  }

  isCancelled(booking: any): boolean {
    return booking.status === 2; // Cancelled status
  }

  hasReturnReservation(booking: any): boolean {
    return !!this.findReturnReservation(booking, this.filteredBookingList);
  }
}
