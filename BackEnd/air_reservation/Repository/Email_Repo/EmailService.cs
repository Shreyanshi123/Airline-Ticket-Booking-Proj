using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

public class EmailService
{
    //Mandatory step below
    private readonly string sendGridApiKey = "YOUR_API_KEY";

    public async Task SendEmailAsync(string recipientEmail, string subject, string body, byte[] attachmentBytes)
    {
        var client = new SendGridClient(sendGridApiKey);
        var from = new EmailAddress("shreyanshimishra7689@gmail.com", "Evalueserve");
        var to = new EmailAddress(recipientEmail);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);


        if (attachmentBytes != null && attachmentBytes.Length > 0)
        {
            var attachment = Convert.ToBase64String(attachmentBytes);
            attachment = attachment.Replace("\r\n", "").Replace("\n", ""); // ✅ Remove unwanted characters

            msg.AddAttachment("ticket.pdf", Convert.ToBase64String(attachmentBytes), "application/pdf", "attachment");
            //msg.AddAttachment("ticket.pdf", attachment, "application/pdf"); // ✅ Correct MIME type
        }


        var response = await client.SendEmailAsync(msg);
        Console.WriteLine($"✅ Email sent with status: {response.StatusCode}");

        File.WriteAllBytes("test_ticket.pdf", attachmentBytes);
        Console.WriteLine("✅ PDF saved locally for testing.");
    }
}