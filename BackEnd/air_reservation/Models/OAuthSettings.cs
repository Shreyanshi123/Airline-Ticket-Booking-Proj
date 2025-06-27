namespace air_reservation.Models
{
    public class OAuthSettings
    {
        public string? ClientId { get; set; }
        public string? ClientSecret { get; set; }
        public string? TokenEndpoint { get; set; }
        public string? GrantType { get; set; }
    }
}
