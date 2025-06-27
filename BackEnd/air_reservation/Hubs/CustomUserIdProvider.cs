using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace air_reservation.Hubs
{
    public class CustomUserIdProvider:IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            var userId = connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"CustomUserIdProvider resolved userId: {userId}");
            return userId ?? "";

        }
    }
}

