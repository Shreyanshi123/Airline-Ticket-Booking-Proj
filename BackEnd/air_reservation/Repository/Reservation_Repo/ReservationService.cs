﻿using air_reservation.Data_Access_Layer;
using air_reservation.Models.Flight_Model_;
using air_reservation.Models.Passenger_Model_;
using air_reservation.Models.Payment_Model_;
using air_reservation.Models.Reservation_Model_;
using air_reservation.Models.Users_Model_;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

namespace air_reservation.Repository.Reservation_Repo
{
    public class ReservationService : IReservationService
    {
        private readonly ApplicationDbContext _context;

        public ReservationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ReservationDTO>> GetReservationsByFlightIdAsync(int flightId)
        {
            var reservations = await _context.Reservations
                .Include(r => r.User) // Include user details
                .Include(r => r.Passengers) // Include passenger details
                .Include(r => r.Payment) // Include payment details
                .Where(r => r.FlightId == flightId)
                .OrderByDescending(r => r.BookingDate) // Sort by booking date
                .ToListAsync();

            return reservations.Select(MapToReservationDTO).ToList();
        }

        public async Task<List<ReservationDTO>> CreateRoundTripReservationAsync(int userId, CreateRoundTripReservationDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            var reservations = new List<Reservation>();

            try
            {
                foreach (var flightId in new[] { dto.OutboundFlightId, dto.ReturnFlightId })
                {
                    var flight = await _context.Flights.FindAsync(flightId);
                    if (flight == null || flight.DepartureDateTime <= DateTime.UtcNow)
                        throw new InvalidOperationException("Invalid flight");

                    var economyCount = dto.Passengers.Count(p => p.SeatClass == SeatClass.Economy);
                    var businessCount = dto.Passengers.Count(p => p.SeatClass == SeatClass.Business);

                    if (flight.AvailableEconomySeats < economyCount || flight.AvailableBusinessSeats < businessCount)
                        throw new InvalidOperationException("Not enough seats");

                    var totalAmount = await CalculateTotalAmountAsync(flightId, dto.Passengers);

                    var reservation = new Reservation
                    {
                        BookingReference = GenerateBookingReference(),
                        UserId = userId,
                        FlightId = flightId,
                        TotalAmount = totalAmount,
                        Status = ReservationStatus.Pending,
                        BookingDate = DateTime.UtcNow,
                        ExpiresAt = DateTime.UtcNow.AddMinutes(15)
                    };

                    _context.Reservations.Add(reservation);
                    await _context.SaveChangesAsync();

                    foreach (var passenger in dto.Passengers)
                    {
                        _context.Passengers.Add(new Passenger
                        {
                            FirstName = passenger.FirstName,
                            LastName = passenger.LastName,
                            Age = passenger.Age,
                            Gender = passenger.Gender,
                            SeatClass = passenger.SeatClass,
                            ReservationId = reservation.Id
                        });
                    }

                    await _context.SaveChangesAsync();
                    reservations.Add(reservation);
                }

                await transaction.CommitAsync();



                var resultArray = await Task.WhenAll(reservations.Select(async r =>
                 MapToReservationDTO(await _context.Reservations
                 .Include(x => x.Flight)
                 .Include(x => x.Passengers)
                 .Include(x => x.Payment)
                 .FirstOrDefaultAsync(x => x.Id == r.Id))
                ));

                return resultArray.ToList();


            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }


        public async Task<List<FlightReservationSummaryDTO>> GetReservationStatusSummaryAsync()
        {
            var allStatuses = Enum.GetValues(typeof(ReservationStatus)).Cast<ReservationStatus>().ToList(); // ✅ Ensure all statuses exist
            var reservationSummary = await _context.Reservations
                .GroupBy(r => new { r.FlightId, r.Flight.FlightNumber, r.Flight.Airline, r.Flight.Origin, r.Flight.Destination })
                .Select(g => new FlightReservationSummaryDTO
                {
                    FlightId = g.Key.FlightId,
                    FlightNumber = g.Key.FlightNumber,
                    Airline = g.Key.Airline,
                    Origin = g.Key.Origin,
                    Destination = g.Key.Destination,
                    StatusCounts = allStatuses.Select(status => new ReservationStatusCountDTO
                    {
                        Status = status,
                        Count = g.Count(r => r.Status == status) // ✅ Ensure missing statuses return 0
                    }).ToList()
                })
                .ToListAsync();

            return reservationSummary;
        }

        public async Task<List<UserDTO>> GetUsersWithReservationsAsync()
        {
            var users = await _context.Users
                .Include(u => u.Reservations)
                    .ThenInclude(r => r.Flight)
                .Include(u => u.Reservations)
                    .ThenInclude(r => r.Passengers)
                .Include(u => u.Reservations)
                    .ThenInclude(r => r.Payment)
                .ToListAsync();

            return users.Select(u => new UserDTO
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Reservations = u.Reservations.Select(MapToReservationDTO).ToList()
            }).ToList();
        }

        // getting the passengers for the particular reservation id since reservation id is all different not getting used in the frontend
        public async Task<List<PassengerDTO>> GetPassengersByReservationAsync(int reservationId)
        {
            var passengers = await _context.Passengers
                .Where(p => p.ReservationId == reservationId)
                .ToListAsync();

            return passengers.Select(p => new PassengerDTO
            {
                FirstName = p.FirstName,
                LastName = p.LastName,
                Age = p.Age,
                Gender = p.Gender,
                SeatClass = p.SeatClass
            }).ToList();
        }


        // updating the passenger based on the passenger id not getting used in the frontend
        public async Task<bool> UpdatePassengerAsync(int passengerId, PassengerDTO updatedPassenger)
        {
            var passenger = await _context.Passengers.FindAsync(passengerId);
            if (passenger == null)
                return false;

            passenger.FirstName = updatedPassenger.FirstName;
            passenger.LastName = updatedPassenger.LastName;
            passenger.Age = updatedPassenger.Age;
            passenger.Gender = updatedPassenger.Gender;
            passenger.SeatClass = updatedPassenger.SeatClass;

            _context.Entry(passenger).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return true;
        }


        // basically creating the reservation taking in the userid it is somehow getting used by taking in the token
        public async Task<ReservationDTO> CreateReservationAsync(int userId, [FromBody] CreateReservationDTO createReservationDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var flight = await _context.Flights.FindAsync(createReservationDto.FlightId);
                if (flight == null)
                    throw new InvalidOperationException("Flight not found");

                if (flight.DepartureDateTime <= DateTime.UtcNow)
                    throw new InvalidOperationException("Cannot book a flight that has already departed");


                // Check seat availability
                var economyPassengers = createReservationDto.Passengers.Count(p => p.SeatClass == SeatClass.Economy);
                var businessPassengers = createReservationDto.Passengers.Count(p => p.SeatClass == SeatClass.Business);

                if (flight.AvailableEconomySeats < economyPassengers)
                    throw new InvalidOperationException("Not enough economy seats available");

                if (flight.AvailableBusinessSeats < businessPassengers)
                    throw new InvalidOperationException("Not enough business seats available");

                //flight.AvailableEconomySeats -= economyPassengers;
                //flight.AvailableBusinessSeats -= businessPassengers;

                // Calculate total amount
                var totalAmount = await CalculateTotalAmountAsync(createReservationDto.FlightId, createReservationDto.Passengers);

                // Create reservation
                var reservation = new Reservation
                {
                    BookingReference = GenerateBookingReference(),
                    UserId = userId,
                    FlightId = createReservationDto.FlightId,
                    TotalAmount = totalAmount,
                    Status = ReservationStatus.Pending,
                    BookingDate = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(15)
                };

                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();

                // Add passengers
                foreach (var passengerDto in createReservationDto.Passengers)
                {
                    var passenger = new Passenger
                    {
                        FirstName = passengerDto.FirstName,
                        LastName = passengerDto.LastName,
                        Age = passengerDto.Age,
                        Gender = passengerDto.Gender,
                        SeatClass = passengerDto.SeatClass,
                        ReservationId = reservation.Id
                    };

                    _context.Passengers.Add(passenger);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Load the complete reservation
                var completeReservation = await _context.Reservations
                    .Include(r => r.Flight)
                    .Include(r => r.Passengers)
                    .Include(r => r.Payment)
                    .FirstOrDefaultAsync(r => r.Id == reservation.Id);

                return MapToReservationDTO(completeReservation);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }


        // getting user reservation for the particular user id using in the booking history 
        public async Task<List<ReservationDTO>> GetUserReservationsAsync(int userId)
        {
            var reservations = await _context.Reservations
                .Include(r => r.Flight)
                .Include(r => r.Passengers)
                .Include(r => r.Payment)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.BookingDate)
                .ToListAsync();

            return reservations.Select(MapToReservationDTO).ToList();
        }
        
        // changing the status of the reservation like u know the timer one
        public async Task<int> CleanupExpiredReservationsAsync()
        {
            var expiredReservations = await _context.Reservations
                .Where(r => r.Status == ReservationStatus.Pending && r.ExpiresAt <= DateTime.UtcNow)
                .ToListAsync();

            Console.WriteLine($"Found {expiredReservations.Count} expired reservations."); // ✅ Debugging output

            foreach (var reservation in expiredReservations)
            {
                reservation.Status = ReservationStatus.Cancelled;
                _context.Entry(reservation).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return expiredReservations.Count; // ✅ Return number of updated reservations
        }



        // getting reservation by id dont know the use maybe i m using in the booking confirmation one or the ticket generation cause the status might changed
        public async Task<ReservationDTO> GetReservationByIdAsync(int reservationId, int userId)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Flight)
                .Include(r => r.Passengers)
                .Include(r => r.Payment)
                .FirstOrDefaultAsync(r => r.Id == reservationId && r.UserId == userId);

            return reservation != null ? MapToReservationDTO(reservation) : null;
        }


        // cancelling the reservation for a particular reservationid and userid
        public async Task<(bool, string, decimal)> CancelReservationAsync(int reservationId, int userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var reservation = await _context.Reservations
                    .Include(r => r.Passengers)
                    .Include(r => r.Flight)
                     .Include(r => r.Payment)
                    .FirstOrDefaultAsync(r => r.Id == reservationId && r.UserId == userId);

                if (reservation == null || reservation.Status == ReservationStatus.Cancelled)
                    return (false,"",0);

                // Check cancellation eligibility
                var daysUntilDeparture = Math.Floor((reservation.Flight.DepartureDateTime - DateTime.UtcNow).TotalDays);
                if (daysUntilDeparture < 1)
                {
                    return (false,"",0); // No cancellation allowed within 24 hours before departure
                }
                

                // Calculate refund amount
                decimal refundPercentage = 0;
                if (daysUntilDeparture >= 15)
                    refundPercentage = 1.0m; // 100% refund
                else if (daysUntilDeparture >= 10)
                    refundPercentage = 0.5m; // 50% refund
                else if (daysUntilDeparture >= 5)
                    refundPercentage = 0.25m; // 25% refund

                // Calculate refund based on total payment
                decimal refundAmount = reservation.Payment?.Amount * refundPercentage ?? 0;
                Console.WriteLine($"Days until departure: {daysUntilDeparture}, Refund percentage: {refundPercentage}");

                // Update reservation status
                reservation.Status = refundAmount > 0 ? ReservationStatus.Refunded : ReservationStatus.Cancelled;
                _context.Entry(reservation).State = EntityState.Modified;



                // Return seats to flight availability
                var economyPassengers = reservation.Passengers.Count(p => p.SeatClass == SeatClass.Economy);
                var businessPassengers = reservation.Passengers.Count(p => p.SeatClass == SeatClass.Business);

                reservation.Flight.AvailableEconomySeats += economyPassengers;
                reservation.Flight.AvailableBusinessSeats += businessPassengers;

                // Process refund if applicable
                if (refundAmount > 0)
                {
                    await ProcessRefund(reservation.Payment.TransactionId, refundAmount);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return (true, "Reservation cancelled successfully.", refundAmount);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        
        // something related to the refund havent used it yet
        
        public async Task ProcessRefund(string transactionId, decimal refundAmount)
        {
            // Simulate calling a payment provider to refund
            Console.WriteLine($"Processing refund: Transaction {transactionId}, Amount: {refundAmount}");

            // Update payment record to reflect refund
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.TransactionId == transactionId);
            if (payment != null)
            {
                payment.Status = PaymentStatus.Refunded;
                payment.Amount -= refundAmount;
            }

            await _context.SaveChangesAsync();
        }



        // calculating but i dont know if i used it in frontend
        public async Task<decimal> CalculateTotalAmountAsync(int flightId, List<PassengerDTO> passengers)
        {
            var flight = await _context.Flights.FindAsync(flightId);
            if (flight == null)
                throw new InvalidOperationException("Flight not found");

            decimal total = 0;

            foreach (var passenger in passengers)
            {
                if (passenger.SeatClass == SeatClass.Economy)
                    total += flight.EconomyPrice;
                else
                    total += flight.BusinessPrice;
            }

            return total;
        }


        // generating the booking reference
        private string GenerateBookingReference()
        {
            return "BK" + DateTime.UtcNow.ToString("yyyyMMddHHmmss") + new Random().Next(100, 999);
        }

        private ReservationDTO MapToReservationDTO(Reservation reservation)
        {
            return new ReservationDTO
            {
                Id = reservation.Id,
                BookingReference = reservation.BookingReference,
                BookingDate = reservation.BookingDate,
                ExpiresAt = reservation.ExpiresAt,
                Status = reservation.Status,
                TotalAmount = reservation.TotalAmount,
                Flight = new FlightDTO
                {
                    Id = reservation.Flight.Id,
                    FlightNumber = reservation.Flight.FlightNumber,
                    Airline = reservation.Flight.Airline,
                    Origin = reservation.Flight.Origin,
                    Destination = reservation.Flight.Destination,
                    DepartureDateTime = reservation.Flight.DepartureDateTime,
                    ArrivalDateTime = reservation.Flight.ArrivalDateTime,
                    EconomyPrice = reservation.Flight.EconomyPrice,
                    BusinessPrice = reservation.Flight.BusinessPrice,
                    Aircraft = reservation.Flight.Aircraft,
                    Status = reservation.Flight.Status
                },
                Passengers = reservation.Passengers.Select(p => new PassengerDTO
                {
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Age = p.Age,
                    Gender = p.Gender,
                    SeatClass = p.SeatClass
                }).ToList(),
                Payment = reservation.Payment != null ? new PaymentDTO
                {
                    Id = reservation.Payment.Id,
                    Amount = reservation.Payment.Amount,
                    PaymentMethod = reservation.Payment.PaymentMethod,
                    Status = reservation.Payment.Status,
                    PaymentDate = reservation.Payment.PaymentDate,
                    TransactionId = reservation.Payment.TransactionId
                } : null
            };
        }
            public async Task<PaginatedReservationHistoryDTO> GetReservationHistoryAsync(int userId, ReservationHistoryFilterDTO filter)
        {
            var query = _context.Reservations
                .Include(r => r.Flight)
                .Include(r => r.Passengers)
                .Include(r => r.Payment)
                .Where(r => r.UserId == userId);

            // Apply filters
            if (filter.JourneyType.HasValue)
            {
                var now = DateTime.UtcNow;
                query = filter.JourneyType.Value switch
                {
                    JourneyType.Past => query.Where(r => r.Flight.ArrivalDateTime < now),
                    JourneyType.Upcoming => query.Where(r => r.Flight.DepartureDateTime > now),
                    JourneyType.Current => query.Where(r => r.Flight.DepartureDateTime <= now && r.Flight.ArrivalDateTime >= now),
                    _ => query
                };
            }

            if (filter.Status.HasValue)
            {
                query = query.Where(r => r.Status == filter.Status.Value);
            }

            if (filter.FromDate.HasValue)
            {
                query = query.Where(r => r.BookingDate >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                query = query.Where(r => r.BookingDate <= filter.ToDate.Value);
            }

            if (!string.IsNullOrEmpty(filter.Airline))
            {
                query = query.Where(r => r.Flight.Airline.Contains(filter.Airline));
            }

            if (!string.IsNullOrEmpty(filter.Origin))
            {
                query = query.Where(r => r.Flight.Origin.Contains(filter.Origin));
            }

            if (!string.IsNullOrEmpty(filter.Destination))
            {
                query = query.Where(r => r.Flight.Destination.Contains(filter.Destination));
            }

            // Apply sorting
            query = filter.SortBy?.ToLower() switch
            {
                "departuredate" => filter.SortDescending
                    ? query.OrderByDescending(r => r.Flight.DepartureDateTime)
                    : query.OrderBy(r => r.Flight.DepartureDateTime),
                "amount" => filter.SortDescending
                    ? query.OrderByDescending(r => r.TotalAmount)
                    : query.OrderBy(r => r.TotalAmount),
                _ => filter.SortDescending
                    ? query.OrderByDescending(r => r.BookingDate)
                    : query.OrderBy(r => r.BookingDate)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            var reservations = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var reservationDTOs = reservations.Select(MapToReservationHistoryDTO).ToList();

            return new PaginatedReservationHistoryDTO
            {
                Reservations = reservationDTOs,
                TotalCount = totalCount,
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasNextPage = filter.Page < totalPages,
                HasPreviousPage = filter.Page > 1
            };
        }

        public async Task<List<ReservationHistoryDTO>> GetUpcomingJourneysAsync(int userId)
        {
            var now = DateTime.UtcNow;

            var reservations = await _context.Reservations
                .Include(r => r.Flight)
                .Include(r => r.Passengers)
                .Include(r => r.Payment)
                .Where(r => r.UserId == userId &&
                           r.Flight.DepartureDateTime > now &&
                           r.Status == ReservationStatus.Confirmed)
                .OrderBy(r => r.Flight.DepartureDateTime)
                .ToListAsync();

            return reservations.Select(MapToReservationHistoryDTO).ToList();
        }

        public async Task<List<ReservationHistoryDTO>> GetPastJourneysAsync(int userId, int limit = 10)
        {
            var now = DateTime.UtcNow;

            var reservations = await _context.Reservations
                .Include(r => r.Flight)
                .Include(r => r.Passengers)
                .Include(r => r.Payment)
                .Where(r => r.UserId == userId && r.Flight.ArrivalDateTime < now)
                .OrderByDescending(r => r.Flight.DepartureDateTime)
                .Take(limit)
                .ToListAsync();

            return reservations.Select(MapToReservationHistoryDTO).ToList();
        }

        public async Task<ReservationHistoryDTO> GetReservationHistoryByIdAsync(int reservationId, int userId)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Flight)
                .Include(r => r.Passengers)
                .Include(r => r.Payment)
                .FirstOrDefaultAsync(r => r.Id == reservationId && r.UserId == userId);

            return reservation != null ? MapToReservationHistoryDTO(reservation) : null;
        }

        public async Task<ReservationHistorySummaryDTO> GetReservationSummaryAsync(int userId)
        {
            var now = DateTime.UtcNow;
            var currentYear = now.Year;

            var reservations = await _context.Reservations
                .Include(r => r.Flight)
                .Where(r => r.UserId == userId)
                .ToListAsync();

            var totalBookings = reservations.Count;
            var upcomingJourneys = reservations.Count(r => r.Flight.DepartureDateTime > now && r.Status == ReservationStatus.Confirmed);
            var completedJourneys = reservations.Count(r => r.Flight.ArrivalDateTime < now && r.Status == ReservationStatus.Confirmed);
            var cancelledBookings = reservations.Count(r => r.Status == ReservationStatus.Cancelled);
            var totalAmountSpent = reservations.Where(r => r.Status == ReservationStatus.Confirmed).Sum(r => r.TotalAmount);
            var amountThisYear = reservations.Where(r => r.BookingDate.Year == currentYear && r.Status == ReservationStatus.Confirmed).Sum(r => r.TotalAmount);

            var mostFrequentDestination = reservations
                .Where(r => r.Status == ReservationStatus.Confirmed)
                .GroupBy(r => r.Flight.Destination)
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key ?? "N/A";

            var preferredAirline = reservations
                .Where(r => r.Status == ReservationStatus.Confirmed)
                .GroupBy(r => r.Flight.Airline)
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key ?? "N/A";

            var monthlyStats = reservations
                .Where(r => r.Status == ReservationStatus.Confirmed)
                .GroupBy(r => new { r.BookingDate.Year, r.BookingDate.Month })
                .Select(g => new MonthlyBookingStatDTO
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM yyyy"),
                    BookingCount = g.Count(),
                    TotalAmount = g.Sum(r => r.TotalAmount)
                })
                .OrderByDescending(s => s.Year)
                .ThenByDescending(s => s.Month)
                .Take(12)
                .ToList();

            return new ReservationHistorySummaryDTO
            {
                TotalBookings = totalBookings,
                UpcomingJourneys = upcomingJourneys,
                CompletedJourneys = completedJourneys,
                CancelledBookings = cancelledBookings,
                TotalAmountSpent = totalAmountSpent,
                AmountThisYear = amountThisYear,
                MostFrequentDestination = mostFrequentDestination,
                PreferredAirline = preferredAirline,
                MonthlyStats = monthlyStats
            };
        }

        public async Task<List<ReservationHistoryDTO>> GetRecentBookingsAsync(int userId, int limit = 5)
        {
            var reservations = await _context.Reservations
                .Include(r => r.Flight)
                .Include(r => r.Passengers)
                .Include(r => r.Payment)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.BookingDate)
                .Take(limit)
                .ToListAsync();

            return reservations.Select(MapToReservationHistoryDTO).ToList();
        }

        public async Task<bool> CanCancelReservationAsync(int reservationId, int userId)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Flight)
                .FirstOrDefaultAsync(r => r.Id == reservationId && r.UserId == userId);

            if (reservation == null || reservation.Status != ReservationStatus.Confirmed)
                return false;

            // Can cancel if departure is more than 24 hours away
            var hoursUntilDeparture = (reservation.Flight.DepartureDateTime - DateTime.UtcNow).TotalHours;
            return hoursUntilDeparture > 24;
        }

        public async Task<bool> CanModifyReservationAsync(int reservationId, int userId)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Flight)
                .FirstOrDefaultAsync(r => r.Id == reservationId && r.UserId == userId);

            if (reservation == null || reservation.Status != ReservationStatus.Confirmed)
                return false;

            // Can modify if departure is more than 48 hours away
            var hoursUntilDeparture = (reservation.Flight.DepartureDateTime - DateTime.UtcNow).TotalHours;
            return hoursUntilDeparture > 48;
        }

        private ReservationHistoryDTO MapToReservationHistoryDTO(Reservation reservation)
        {
            var now = DateTime.UtcNow;
            var departureTime = reservation.Flight.DepartureDateTime;
            var arrivalTime = reservation.Flight.ArrivalDateTime;

            var journeyType = JourneyType.Past;
            if (departureTime > now)
                journeyType = JourneyType.Upcoming;
            else if (departureTime <= now && arrivalTime >= now)
                journeyType = JourneyType.Current;

            var daysUntilDeparture = (int)(departureTime - now).TotalDays;

            return new ReservationHistoryDTO
            {
                Id = reservation.Id,
                BookingReference = reservation.BookingReference,
                BookingDate = reservation.BookingDate,
                Status = reservation.Status,
                TotalAmount = reservation.TotalAmount,
                JourneyType = journeyType,
                DaysUntilDeparture = daysUntilDeparture,
                CanCancel = reservation.Status == ReservationStatus.Confirmed && (departureTime - now).TotalHours > 24,
                CanModify = reservation.Status == ReservationStatus.Confirmed && (departureTime - now).TotalHours > 48,
                Flight = new FlightHistoryDTO
                {
                    Id = reservation.Flight.Id,
                    FlightNumber = reservation.Flight.FlightNumber,
                    Airline = reservation.Flight.Airline,
                    Origin = reservation.Flight.Origin,
                    Destination = reservation.Flight.Destination,
                    DepartureDateTime = reservation.Flight.DepartureDateTime,
                    ArrivalDateTime = reservation.Flight.ArrivalDateTime,
                    EconomyPrice = reservation.Flight.EconomyPrice,
                    BusinessPrice = reservation.Flight.BusinessPrice,
                    Aircraft = reservation.Flight.Aircraft,
                    Status = reservation.Flight.Status
                },
                Passengers = reservation.Passengers.Select(p => new PassengerHistoryDTO
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Age = p.Age,
                    Gender = p.Gender,
                    SeatClass = p.SeatClass,
                    SeatNumber = p.SeatNumber ?? "Not Assigned",
                    TicketNumber = $"TKT{reservation.Id:D6}{p.Id:D3}"
                }).ToList(),
                Payment = reservation.Payment != null ? new PaymentHistoryDTO
                {
                    Id = reservation.Payment.Id,
                    Amount = reservation.Payment.Amount,
                    PaymentMethod = reservation.Payment.PaymentMethod,
                    Status = reservation.Payment.Status,
                    PaymentDate = reservation.Payment.PaymentDate,
                    TransactionId = reservation.Payment.TransactionId
                } : null
            };
        }
    }
    }




// Admin specific fetch all reservation summaries for all users 
//public async Task<ReservationHistorySummaryDTO> GetAdminReservationSummaryAsync()
//{
//    var now = DateTime.UtcNow;
//    var currentYear = now.Year;

//    var reservations = await _context.Reservations
//        .Include(r => r.Flight)
//        .ToListAsync(); // Removed user filter to fetch all reservations

//    var totalBookings = reservations.Count;
//    var totalRevenue = reservations.Where(r => r.Status == ReservationStatus.Confirmed).Sum(r => r.TotalAmount);
//    var topAirline = reservations
//        .Where(r => r.Status == ReservationStatus.Confirmed)
//        .GroupBy(r => r.Flight.Airline)
//        .OrderByDescending(g => g.Count())
//        .FirstOrDefault()?.Key ?? "N/A";

//    return new ReservationHistorySummaryDTO
//    {
//        TotalBookings = totalBookings,
//        TotalAmountSpent = totalRevenue,
//        PreferredAirline = topAirline
//    };
//}