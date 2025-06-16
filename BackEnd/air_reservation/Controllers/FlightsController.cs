using air_reservation.Data_Access_Layer;
using air_reservation.Models.Flight_Model_;
using air_reservation.Repository.Flight_Repo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;


namespace air_reservation.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly IFlightService _flightService;
        private readonly IHubContext<NotificationHub> _hubContext;


        private readonly ApplicationDbContext _context;
        public FlightsController(IHubContext<NotificationHub> hubContext, IFlightService flightService, ApplicationDbContext context)
        {
            _flightService = flightService;
            _context = context;
            _hubContext = hubContext;

        }

        //[HttpGet("recommendations/{userId}")]
        //public async Task<IActionResult> GetRecommendations(int userId)
        //{
        //    var user = await _context.Users.Include(u => u.Reservations)
        //                                    .ThenInclude(r => r.Flight)
        //                                   .FirstOrDefaultAsync(u => u.Id == userId);

        //    if (user == null)
        //        return NotFound("User not found.");

        //    if (user.Reservations == null || !user.Reservations.Any())
        //        return NotFound("No booking history found for recommendations.");


        //    var frequentDestinations = user?.Reservations?
        //                                                .Where(r => r.Flight != null)
        //                                                .GroupBy(r => r.Flight.Destination)
        //                                                .OrderByDescending(g => g.Count())
        //                                                .Select(g => g.Key)
        //                                                .Take(3)
        //                                                .ToList();

        //    var recommendedFlights = await _context.Flights.Where(f => frequentDestinations.Contains(f.Destination))
        //                                                   .ToListAsync();

        //    return Ok(recommendedFlights);
        //}


        [HttpGet("recommendations/{userId}")]
        public async Task<IActionResult> GetRecommendations(int userId)
        {
            var userHistory = await _context.Reservations
                .Where(r => r.UserId == userId && r.Flight != null)
                .GroupBy(r => r.Flight.Destination)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .Take(3)
                .ToListAsync();

            if (userHistory == null || !userHistory.Any())
                return NotFound("No booking history found for recommendations.");

            var recommendedFlights = await _context.Flights
                .Where(f => userHistory.Contains(f.Destination))
                .ToListAsync();

            return Ok(recommendedFlights);
        }

        [HttpPut("{flightId}/update-times")]
        public async Task<IActionResult> UpdateFlightTimes(int flightId, [FromBody] FlightTimeUpdateDTO updateDto)
        {
            var success = await _flightService.UpdateFlightTimesAsync(flightId, updateDto.DepartureDateTime, updateDto.ArrivalDateTime);
            if (success)
            {
                await _hubContext.Clients.All.SendAsync("ReceiveNotification", $"Flight {flightId} has been updated!");
                return Ok(new { message = "Flight times updated successfully!" });
            }

            return success ? Ok(new { message = "Flight times updated successfully!" }) : NotFound(new { message = "Flight not found." });
        }


        [HttpGet("popular")]
        public async Task<ActionResult<List<PopularFlightDTO>>> GetPopularFlights()
        {
            var flights = await _flightService.GetPopularFlightsAsync();

            if (flights == null || flights.Count == 0)
                return NotFound("No popular flight routes found.");

            return Ok(flights);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<FlightDTO>>> SearchFlights([FromQuery] FlightSearchDTO searchDto)
        {
            var flights = await _flightService.SearchFlightsAsync(searchDto);
            return Ok(flights);
        }

        [HttpGet]
        public async Task<ActionResult<List<FlightDTO>>> GetAllFlights()
        {
            var flights = await _flightService.GetAllFlightsAsync();
            return Ok(flights);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FlightDTO>> GetFlight(int id)
        {
            var flight = await _flightService.GetFlightByIdAsync(id);
            if (flight == null)
                return NotFound();

            return Ok(flight);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Only Admin can create flights
        public async Task<ActionResult<FlightDTO>> CreateFlight([FromBody] FlightDTO flightDto)
        {
            var createdFlight = await _flightService.CreateFlightAsync(flightDto);
            return CreatedAtAction(nameof(GetFlight), new { id = createdFlight.Id }, createdFlight);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Only Admin can update flights
        public async Task<ActionResult<FlightDTO>> UpdateFlight(int id, [FromBody] FlightDTO flightDto)
        {
            var updatedFlight = await _flightService.UpdateFlightAsync(id, flightDto);
            if (updatedFlight == null)
                return NotFound();
            // ✅ Notify users of general updates
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", $"Flight {updatedFlight.FlightNumber} details have been updated!");


            return Ok(updatedFlight);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only Admin can delete flights
        public async Task<ActionResult> DeleteFlight(int id)
        {
            var result = await _flightService.DeleteFlightAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
