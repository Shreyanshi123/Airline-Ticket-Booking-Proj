using air_reservation.Data_Access_Layer;
using air_reservation.Hubs;
using air_reservation.Models;
using air_reservation.Repository.Flight_Repo;
using air_reservation.Repository.Login_Repo;
using air_reservation.Repository.Payment_Repo;
using air_reservation.Repository.Reservation_Repo;
using air_reservation.Repository.SMS_Repo;
using air_reservation.Repository.User_Repo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//builder.Services.Configure<OAuthSettings>(builder.Configuration.GetSection("OAuthSettings"));
//builder.Services.Configure<ApiSettings>(builder.Configuration.GetSection("ApiSettings"));

//builder.Services.AddHttpClient("ApiClient", client =>
//{
    //var apiSettings = builder.Configuration.GetSection("ApiSettings").Get<ApiSettings>();
    //client.BaseAddress = new Uri(apiSettings.BaseUrl);
//})
//.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
//{
    //ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
//});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHostedService<ReservationCleanupService>();

string? con = builder.Configuration.GetConnectionString("AppConnection");

builder.Services.AddDbContext<ApplicationDbContext>(Options => {
    Options.UseSqlServer(con);
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});


builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFlightService, FlightService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();
builder.Services.AddScoped<RecommendationService>();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
// ✅ Register SmsService for Dependency Injection
builder.Services.AddHttpClient<SmsService>();
builder.Services.AddScoped<SmsService>();




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");


app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");



app.Run();
