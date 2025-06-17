import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FlightsService } from '../../../services/flights.service';
import Swal from 'sweetalert2';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { RecommendationService } from '../../../services/recommendation.service';
import { AuthService } from '../../../services/auth.service';
import { AnalyticsService } from '../../../services/analytics.service';

// Interfaces
interface Particle {
  x: number;
  delay: number;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Flight {
  id?: string;
  flightNumber: string;
  airline: {
    airlineCode: string;
  };
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  ticketPrice: number;
  origin?: string;
  destination?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [DatePipe],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private flightService = inject(FlightsService);
  recommendedFlights: any[] = [];
  userId: number | null = null;

 

  // Form Configuration
  searchForm: FormGroup = new FormGroup({
    departureCity: new FormControl('', [Validators.required]),
    arrivalCity: new FormControl('', [Validators.required]),
    departureTime: new FormControl('', [Validators.required]),
    returnTime: new FormControl(''),
    seatClass: new FormControl('economy', [Validators.required])
  });

  // Data Properties
  flights: Flight[] = [];
  allOrigins: string[] = [];
  allDestinations: string[] = [];
  filteredOrigins: string[] = [];
  filteredDestinations: string[] = [];

  // UI State
  isRoundTrip = false;
  selectedClass = 'economy';
  focusedField: string | null = null;
  isSearching = false;
  passengerCount = 1;
  minDate = '';
  newsletterEmail = '';

  // Animation Properties
  particles: Particle[] = [];

  // Static Data
  features: Feature[] = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Booking',
      description: 'Your transactions are protected with bank-level security and encryption for complete peace of mind.'
    },
    {
      icon: 'fas fa-clock',
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you with any queries or travel emergencies.'
    },
    {
      icon: 'fas fa-tags',
      title: 'Best Prices',
      description: 'Compare prices from hundreds of airlines to find the best deals for your journey.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Booking',
      description: 'Book flights on-the-go with our mobile-optimized platform and instant confirmations.'
    },
    {
      icon: 'fas fa-gift',
      title: 'Loyalty Rewards',
      description: 'Earn points with every booking and redeem them for discounts on future travels.'
    },
    {
      icon: 'fas fa-globe',
      title: 'Worldwide Coverage',
      description: 'Access to 500+ destinations worldwide with partnerships with major airlines globally.'
    }
  ];

  constructor(private router: Router, private datePipe: DatePipe,private recommendationService: AnalyticsService, private authService: AuthService) {
    this.initializeComponent();
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserData().user.id; // ✅ Get user ID from AuthService
    if (this.userId) {
      this.fetchRecommendations();
    }

    this.loadFlightData();
    this.setupFormListeners();
    this.generateParticles();
  }
  fetchRecommendations() {
    this.recommendationService.getPopularFlights().subscribe({
      next: (flights) => {
        this.recommendedFlights = flights;
        console.log("Recommended Flights:", this.recommendedFlights);
      },
      error: (error) => {
        console.error("Error fetching recommendations:", error);
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialization Methods
  private initializeComponent(): void {
    this.setMinDate();
    this.setupInitialFormState();
  }

  private setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  private setupInitialFormState(): void {
    // Set default values
    this.searchForm.patchValue({
      seatClass: 'economy'
    });
  }

  private generateParticles(): void {
    this.particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * 100,
      delay: Math.random() * 8
    }));
  }

  // Data Loading
  private loadFlightData(): void {
    this.flightService.getFlights()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (flights: Flight[]) => {
          this.processFlightData(flights);
        },
        error: (error) => {
          console.error('Error loading flight data:', error);
          this.showErrorMessage('Failed to load flight data. Please try again later.');
        }
      });
  }

  private processFlightData(flights: Flight[]): void {
    this.allOrigins = [...new Set(flights.map(flight => flight.origin || flight.departureAirport))];
    this.allDestinations = [...new Set(flights.map(flight => flight.destination || flight.arrivalAirport))];
    
    // Sort alphabetically for better UX
    this.allOrigins.sort();
    this.allDestinations.sort();
  }

  // Form Listeners
  private setupFormListeners(): void {
    this.setupDepartureCityListener();
    this.setupArrivalCityListener();
    this.setupTripTypeListener();
  }

  private setupDepartureCityListener(): void {
    this.searchForm.get('departureCity')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.filteredOrigins = this.filterCities(value, this.allOrigins);
      });
  }

  private setupArrivalCityListener(): void {
    this.searchForm.get('arrivalCity')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.filteredDestinations = this.filterCities(value, this.allDestinations);
      });
  }

  private setupTripTypeListener(): void {
    // Monitor round trip changes through the component property
    // This will be handled by the setTripType method
  }

  private filterCities(searchValue: string, cities: string[]): string[] {
    if (!searchValue || searchValue.length < 1) {
      return [];
    }
    
    return cities
      .filter(city => city.toLowerCase().includes(searchValue.toLowerCase()))
      .slice(0, 6); // Limit results for better performance
  }

  // UI Event Handlers
  setTripType(isRoundTrip: boolean): void {
    this.isRoundTrip = isRoundTrip;
    
    if (isRoundTrip) {
      this.searchForm.get('returnTime')?.setValidators([Validators.required]);
    } else {
      this.searchForm.get('returnTime')?.clearValidators();
      this.searchForm.get('returnTime')?.setValue('');
    }
    
    this.searchForm.get('returnTime')?.updateValueAndValidity();
  }

  onFieldFocus(field: string): void {
    this.focusedField = field;
  }

  onFieldBlur(field: string): void {
    // Delay hiding dropdown to allow for click events
    setTimeout(() => {
      if (this.focusedField === field) {
        this.focusedField = null;
      }
    }, 200);
  }

  selectOrigin(origin: string): void {
    this.searchForm.get('departureCity')?.setValue(origin);
    this.filteredOrigins = [];
    this.focusedField = null;
    this.showSelectionFeedback(`Selected ${origin} as departure city`);
  }

  selectDestination(destination: string): void {
    this.searchForm.get('arrivalCity')?.setValue(destination);
    this.filteredDestinations = [];
    this.focusedField = null;
    this.showSelectionFeedback(`Selected ${destination} as destination`);
  }

  swapCities(): void {
    const currentDeparture = this.searchForm.get('departureCity')?.value;
    const currentArrival = this.searchForm.get('arrivalCity')?.value;

    this.searchForm.patchValue({
      departureCity: currentArrival,
      arrivalCity: currentDeparture
    });

    this.showSelectionFeedback('Cities swapped successfully');
  }

  increasePassengers(): void {
    if (this.passengerCount < 9) {
      this.passengerCount++;
    }
  }

  decreasePassengers(): void {
    if (this.passengerCount > 1) {
      this.passengerCount--;
    }
  }

  // Form Submission
  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.handleInvalidForm();
      return;
    }

    if (!this.validateDates()) {
      return;
    }

    this.performSearch();
  }

  private handleInvalidForm(): void {
    this.markFormGroupTouched();
    
    const missingFields = this.getMissingRequiredFields();
    const errorMessage = `Please fill in the following required fields: ${missingFields.join(', ')}`;
    
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Form',
      text: errorMessage,
      confirmButtonColor: '#667eea',
      confirmButtonText: 'OK'
    });
  }

  private getMissingRequiredFields(): string[] {
    const missingFields: string[] = [];
    const controls = this.searchForm.controls;

    if (controls['departureCity'].invalid) missingFields.push('Departure City');
    if (controls['arrivalCity'].invalid) missingFields.push('Destination City');
    if (controls['departureTime'].invalid) missingFields.push('Departure Date');
    if (this.isRoundTrip && controls['returnTime'].invalid) missingFields.push('Return Date');

    return missingFields;
  }

  private validateDates(): boolean {
    const departureDate = new Date(this.searchForm.get('departureTime')?.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (departureDate < today) {
      this.showErrorMessage('Departure date cannot be in the past');
      return false;
    }

    if (this.isRoundTrip) {
      const returnDate = new Date(this.searchForm.get('returnTime')?.value);
      if (returnDate <= departureDate) {
        this.showErrorMessage('Return date must be after departure date');
        return false;
      }
    }

    return true;
  }

  private performSearch(): void {
    this.isSearching = true;
    const formData = this.prepareSearchData();

    // Simulate search delay for better UX
    setTimeout(() => {
      this.navigateToResults(formData);
      this.isSearching = false;
    }, 1200);
  }

  private prepareSearchData(): any {
    const formValue = this.searchForm.value;
    
    return {
      origin: formValue.departureCity,
      destination: formValue.arrivalCity,
      departureDate: this.datePipe.transform(formValue.departureTime, 'yyyy-MM-dd'),
      returnDate: this.isRoundTrip ? this.datePipe.transform(formValue.returnTime, 'yyyy-MM-dd') : null,
      passengers: this.passengerCount,
      seatClass: formValue.seatClass,
      isRoundTrip: this.isRoundTrip
    };
  }

  private navigateToResults(searchData: any): void {
    this.router.navigate(['/search'], {
      queryParams: {
        origin: searchData.origin,
        destination: searchData.destination,
        DepartureDate: searchData.departureDate,
        ReturnDate: searchData.returnDate,
        passengers: searchData.passengers,
        seatClass: searchData.seatClass,
        isRoundTrip: searchData.isRoundTrip
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.searchForm.controls).forEach(key => {
      const control = this.searchForm.get(key);
      control?.markAsTouched();
    });
  }

  // Flight Booking
  bookFlight(flight: Flight): void {
    Swal.fire({
      icon: 'success',
      title: 'Flight Selected!',
      text: `You selected flight ${flight.airline.airlineCode}-${flight.flightNumber} for ₹${flight.ticketPrice}`,
      confirmButtonColor: '#667eea',
      confirmButtonText: 'Proceed to Booking',
      showCancelButton: true,
      cancelButtonText: 'Continue Searching'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proceedToBooking(flight);
      }
    });
  }

  private proceedToBooking(flight: Flight): void {
    this.router.navigate(['/booking'], {
      queryParams: {
        flightId: flight.id,
        passengers: this.passengerCount,
        seatClass: this.selectedClass,
        price: flight.ticketPrice
      }
    });
  }

  // Newsletter Subscription
  subscribeNewsletter(): void {
    if (!this.isValidEmail(this.newsletterEmail)) {
      this.showErrorMessage('Please enter a valid email address');
      return;
    }

    // Simulate API call
    this.simulateNewsletterSubscription();
  }

  private simulateNewsletterSubscription(): void {
    const loadingSwal = Swal.fire({
      title: 'Subscribing...',
      text: 'Please wait while we process your subscription',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      // loadingSwal.close();
      Swal.fire({
        icon: 'success',
        title: 'Successfully Subscribed!',
        text: 'Thank you for subscribing to our newsletter. You\'ll receive the latest deals and travel tips.',
        confirmButtonColor: '#667eea',
        timer: 3000,
        timerProgressBar: true
      });
      
      this.newsletterEmail = '';
    }, 1500);
  }

  // Utility Methods
  private isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showSelectionFeedback(message: string): void {
    // You can implement a toast notification here
    console.log(message);
    
    // Optional: Show a subtle toast notification
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

    toast.fire({
      icon: 'success',
      title: message
    });
  }

  private showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: message,
      confirmButtonColor: '#667eea'
    });
  }

  // Template Helper Methods
  trackByIndex(index: number, item: any): number {
    return index;
  }

  // Animation Event Handlers (optional)
  onMouseEnter(element: any): void {
    // Add hover animations if needed
  }

  onMouseLeave(element: any): void {
    // Remove hover animations if needed
  }

  // Accessibility Methods
  onKeyDown(event: KeyboardEvent, action: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }

  // Performance Optimization
  private debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
}