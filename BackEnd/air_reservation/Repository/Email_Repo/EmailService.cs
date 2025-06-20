using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

public class EmailService
{
    //Mandatory step below
    private readonly string sendGridApiKey = "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";

    public async Task SendEmailAsync(string recipientEmail, string subject, string body, byte[] attachmentBytes)
    {
        var client = new SendGridClient(sendGridApiKey);
        var from = new EmailAddress("shreyanshimishra7689@gmail.com", "Evalueserve");
        var to = new EmailAddress(recipientEmail);
        //var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent: "Your ticket is attached.", htmlContent: body);


        if (attachmentBytes != null && attachmentBytes.Length > 0)
        {
            //var attachment = Convert.ToBase64String(attachmentBytes);
            //attachment = attachment.Replace("\r\n", "").Replace("\n", ""); // ✅ Remove unwanted characters

            //msg.AddAttachment("ticket.pdf", Convert.ToBase64String(attachmentBytes), "application/pdf", "attachment");
            //msg.AddAttachment("ticket.pdf", attachment, "application/pdf"); // ✅ Correct MIME type

            var attachment = Convert.ToBase64String(attachmentBytes);
            var sendGridAttachment = new Attachment
            {
                Content = attachment,
                Filename = "ticket.pdf",
                Type = "application/pdf",
                //Type = "application/png",

                Disposition = "attachment"
            };
            msg.AddAttachment(sendGridAttachment);

        }


        var response = await client.SendEmailAsync(msg);
        Console.WriteLine($"✅ Email sent with status: {response.StatusCode}");

        File.WriteAllBytes("test_ticket.pdf", attachmentBytes);
        Console.WriteLine("✅ PDF saved locally for testing.");
    }
}