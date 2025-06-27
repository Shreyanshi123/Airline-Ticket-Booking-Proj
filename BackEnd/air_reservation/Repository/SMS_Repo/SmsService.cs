using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;



namespace air_reservation.Repository.SMS_Repo
{
    public class SmsService
    {
        private readonly HttpClient _httpClient;
        private readonly string _smsApiKey = "xaxqqDTe80px3x2IHW0EduPcy9GQp75L"; // Replace with actual API key
        private readonly string _smsSenderId = "36034"; // Replace with actual sender ID

        public SmsService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> SendSmsAsync(string phoneNumber, string message)
        {
            var url = "https://api.smsmode.com/http/1.6/sendSMS.do"; // ✅ Correct API endpoint

            var payload = new Dictionary<string, string>
    {
        { "accessToken",_smsApiKey }, // ✅ Use correct API key
        { "sender", _smsSenderId }, // ✅ Use approved sender ID
        { "to", phoneNumber },
        { "message", message }
    };

            var content = new FormUrlEncodedContent(payload);
            var response = await _httpClient.PostAsync(url, content);

            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"SMS API Response: {responseContent}"); // ✅ Log response

            return response.IsSuccessStatusCode;
        }
    }
}




   

    

