using air_reservation.Models.Users_Model_;
using air_reservation.Repository.Reservation_Repo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace air_reservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public UsersController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet("UsersWithReservations")]
        public async Task<ActionResult<List<UserDTO>>> GetUsersWithReservations()
        {
            var users = await _reservationService.GetUsersWithReservationsAsync();

            if (users == null || users.Count == 0)
                return NotFound("No users found with reservations.");

            return Ok(users);
        }


    }
}
