using air_reservation.Data_Access_Layer;
using air_reservation.Models.Payment_Model_;
using air_reservation.Models.Reservation_Model_;
using air_reservation.Repository.Payment_Repo;
using air_reservation.Repository.SMS_Repo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace air_reservation.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly SmsService _smsService;
        private readonly ApplicationDbContext _context;

        public PaymentsController(IPaymentService paymentService, ApplicationDbContext context, IHubContext<NotificationHub> hubContext, SmsService smsService)
        {
            _paymentService = paymentService;
            _context = context;
            _hubContext = hubContext;
            _smsService = smsService;
        }

        private int GetCurrentUserId()

        {

            return int.Parse(User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value ?? "0");

        }
        [HttpPost("process")]
        public async Task<ActionResult<PaymentDTO>> ProcessPayment([FromBody] ProcessPaymentDTO processPaymentDto)
        {
            int userId = GetCurrentUserId();
            try
            {
                var result = await _paymentService.ProcessPaymentAsync(processPaymentDto);
                var user =  _context.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found." });
                }

                if (result.Status == PaymentStatus.Failed)
                {
                    return BadRequest("Payment failed. Please try again.");

                }

                else
                {
                    await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", $"Flight {result.Amount} has been booked and paid");
                    //await _hubContext.Clients.All.SendAsync("ReceiveNotification", $"Flight {result.Status} has been booked and paid ");

                    // Send SMS Notification
                    string message = $"Payment successful! Amount: {result.Amount}. Your flight is confirmed.";
                    await _smsService.SendSmsAsync(user?.PhoneNumber, message); // ✅ Fixed


                    return Ok(result);
                }

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("reservation/{reservationId}")]
        public async Task<ActionResult<PaymentDTO>> GetPaymentByReservation(int reservationId)
        {
            var payment = await _paymentService.GetPaymentByReservationIdAsync(reservationId);

            if (payment == null)
                return NotFound();

            return Ok(payment);
        }

        [HttpPost("{id}/refund")]
        public async Task<ActionResult> RefundPayment(int id)
        {
            var result = await _paymentService.RefundPaymentAsync(id);

            if (!result)
                return BadRequest(new { message = "Unable to process refund" });

            return Ok(new { message = "Refund processed successfully" });
        }
    }
}
