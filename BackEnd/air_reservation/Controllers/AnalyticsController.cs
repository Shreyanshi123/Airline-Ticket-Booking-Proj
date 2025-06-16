using air_reservation.Data_Access_Layer;
using air_reservation.Models.Reservation_Model_;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;


namespace air_reservation.Controllers
{

    

    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }


        // ✅ Total Reservations Today
        [HttpGet("admin/reservations-today")]
        public IActionResult GetReservationsToday()
        {
            var today = DateTime.UtcNow.Date;
            var totalReservations = _context.Reservations.Count(r => r.BookingDate.Date == today);

            return Ok(new { total = totalReservations });
        }


        // ✅ Total Revenue Today
        [HttpGet("admin/revenue-today")]
        public IActionResult GetRevenueToday()
        {
            var today = DateTime.UtcNow.Date;
            var totalRevenue = _context.Reservations.Where(r => r.BookingDate.Date == today)
                .Sum(r => r.TotalAmount);

            return Ok(new { amount = totalRevenue });
        }

        // ✅ Active Users Today (users who made a booking today)
        [HttpGet("admin/active-users")]
        public IActionResult GetActiveUsers()
        {
            var today = DateTime.UtcNow.Date;

            var activeUsersCount = _context.LoginLogs // ✅ Use LoginModel, not User
                .Where(l => l.LoginTime.Date == today && l.IsSuccessful) // ✅ Ensure successful logins
                .Select(l => l.Email) // ✅ Get unique emails of logged-in users
                .Distinct() // ✅ Count only unique users
                .Count();

            return Ok(new { count = activeUsersCount });
        }

        //✅ Popular Flight Routes(Top 3 most booked routes)
        [HttpGet("admin/popular-routes")]
        public IActionResult GetPopularRoutes()
        {
            var popularRoutes = _context.Reservations
                .Include(r => r.Flight) // ✅ Ensure Flight details are loaded
                .GroupBy(r => new { r.Flight.Origin, r.Flight.Destination }) // ✅ Use Flight Origin & Destination
                .Select(g => new
                {
                    Origin = g.Key.Origin,
                    Destination = g.Key.Destination,
                    TotalReservations = g.Count()
                })
                .OrderByDescending(g => g.TotalReservations)
                .Take(3) // ✅ Get only the Top 3 popular routes
                .ToList();

            return Ok(new { routes = popularRoutes });
        }



        [HttpGet("admin/daily-sales")]
        public IActionResult GetDailySales()
        {
            var sales = _context.Reservations
                .Where(r => r.BookingDate >= DateTime.Now.AddDays(-30))  // last 30 days (or as needed)
                .GroupBy(r => r.BookingDate.Date)
                .Select(g => new {
                    Date = g.Key,
                    TotalAmount = g.Sum(r => r.TotalAmount)
                })
                .OrderBy(r => r.Date)
                .ToList();

            Console.WriteLine($"Daily Sales Data: {JsonConvert.SerializeObject(sales)}"); // Log output


            return Ok(sales);
        }


        [HttpGet("admin/booking-trends")]
        public IActionResult GetBookingTrends()
        {
            var trends = _context.Reservations
                .GroupBy(r => r.BookingDate.Date)
                .Select(g => new {
                    Date = g.Key,
                    Bookings = g.Count()
                })
                .OrderBy(g => g.Date)
                .ToList();

            return Ok(trends);
        }


        [HttpGet("admin/revenue-trends")]
        public IActionResult GetRevenueTrends()
        {
            var trends = _context.Reservations
                .GroupBy(r => r.BookingDate.Date)
                .Select(g => new {
                    Date = g.Key,
                    Revenue = g.Sum(r => r.TotalAmount)
                })
                .OrderBy(g => g.Date)
                .ToList();

            return Ok(trends);
        }

        [HttpGet("admin/cancellations")]
        public IActionResult GetCancellationStats()
        {
            var cancellations = _context.Reservations
                .Where(r => (r.Status == ReservationStatus.Cancelled)).ToList()  // assuming you have cancellation flag
                .GroupBy(r => r.BookingDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Cancellations = g.Count()
                })
                .OrderBy(g => g.Date)
                .ToList();

            Console.WriteLine($"Cancellations Data: {JsonConvert.SerializeObject(cancellations)}"); // ✅ Debugging output


            return Ok(cancellations);
        }
    }
}
