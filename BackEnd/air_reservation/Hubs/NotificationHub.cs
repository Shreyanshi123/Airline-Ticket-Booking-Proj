using air_reservation.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

public class NotificationHub : Hub
{
    public async Task SendNotification(string message)
    {
        
        await Clients.All.SendAsync("ReceiveNotification", message);
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        Console.WriteLine($"User connected: {userId}");
        await base.OnConnectedAsync();
    }


    public async Task SendNotificationToUser(string userId, string message)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", message);
    }

}
