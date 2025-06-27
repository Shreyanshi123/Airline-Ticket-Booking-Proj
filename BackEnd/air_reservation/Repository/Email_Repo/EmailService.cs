using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

public class EmailService
{
    //Mandatory step below
    private readonly string sendGridApiKey = "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";

    public async Task SendEmailAsync(string recipientEmail, string subject, string body, string attachmentBase64)
    {
        var client = new SendGridClient(sendGridApiKey);
        var from = new EmailAddress("shreyanshimishra7689@gmail.com", "Evalueserve");
        var to = new EmailAddress(recipientEmail);
        //var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent: "Your ticket is attached.", htmlContent: body);


        if (!string.IsNullOrEmpty(attachmentBase64))
        {
            var sendGridAttachment = new Attachment
            {
                Content = attachmentBase64, // ✅ Use Base64 PDF from frontend
                Filename = "ticket.pdf",
                Type = "application/pdf",
                Disposition = "attachment"
            };
            msg.AddAttachment(sendGridAttachment);
        }




        var response = await client.SendEmailAsync(msg);
        Console.WriteLine($"✅ Email sent with status: {response.StatusCode}");
    }
}