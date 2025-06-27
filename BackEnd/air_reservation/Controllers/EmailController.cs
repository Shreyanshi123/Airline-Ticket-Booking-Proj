using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/email")]
[ApiController]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController()
    {
        _emailService = new EmailService();
    }


    //    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    //    {
    //        if (string.IsNullOrEmpty(request.To))
    //        {
    //            return BadRequest("Recipient email is required.");
    //        }
    //        string fileBytes = null;

    //        if (!string.IsNullOrEmpty(request.AttachmentBase64))
    //        {
    //            fileBytes = Convert.FromBase64String(request.AttachmentBase64); // ✅ Convert Base64 to byte array
    //        }

    //        await _emailService.SendEmailAsync(request.To, request.Subject, request.Body,fileBytes);
    //        return Ok("✅ Email sent successfully via SendGrid!");
    //    }
    //}

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        if (string.IsNullOrEmpty(request.To))
        {
            return BadRequest("❌ Recipient email is required.");
        }

        string base64Attachment = null;

        if (!string.IsNullOrEmpty(request.AttachmentBase64))
        {
            try
            {
                byte[] fileBytes = Convert.FromBase64String(request.AttachmentBase64); 

            
                base64Attachment = Convert.ToBase64String(fileBytes);

               
                Console.WriteLine("✅ PDF saved locally for testing.");
            }
            catch (FormatException ex)
            {
                Console.WriteLine($"❌ Invalid Base64 format: {ex.Message}");
                return BadRequest("❌ Invalid attachment format.");
            }
        }

        await _emailService.SendEmailAsync(request.To, request.Subject, request.Body, base64Attachment);
        return Ok("✅ Email sent successfully via SendGrid!");
    }

    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }

        public string AttachmentBase64 { get; set; }
    }
}