using air_reservation.Models;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace air_reservation.Repository
{
    public class ApiService
    {
        //    private readonly IHttpClientFactory _httpClientFactory;
        //    private readonly OAuthSettings _oauthSettings;
        //    private readonly ApiSettings _apiSettings;

        //    public ApiService(IHttpClientFactory httpClientFactory, IOptions<OAuthSettings> oauthOptions, IOptions<ApiSettings> apiOptions)
        //    {
        //        _httpClientFactory = httpClientFactory;
        //        _oauthSettings = oauthOptions.Value;
        //        _apiSettings = apiOptions.Value;
        //    }

        //    public async Task<string?> GetAccessTokenAsync()
        //    {
        //        var client = _httpClientFactory.CreateClient("ApiClient");

        //        var authHeaderValue = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_oauthSettings.ClientId}:{_oauthSettings.ClientSecret}"));
        //        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);

        //        var formData = new Dictionary<string, string>
        //    {
        //        {"grant_type", _oauthSettings.GrantType}
        //    };

        //        var tokenResponse = await client.PostAsync(_oauthSettings.TokenEndpoint, new FormUrlEncodedContent(formData));
        //        var rawResponse = await tokenResponse.Content.ReadAsStringAsync();
        //        var tokenData = JsonSerializer.Deserialize<OAuthTokenResponse>(rawResponse);

        //        return tokenData?.AccessToken;
        //    }
        //    public async Task<string?> MakeAuthenticatedRequest(object data)
        //    {
        //        var token = await GetAccessTokenAsync();
        //        if (string.IsNullOrEmpty(token)) return null;

        //        var client = _httpClientFactory.CreateClient("ApiClient");
        //        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        //        var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
        //        var response = await client.PostAsync(_apiSettings.ProtectedEndpoint, content);
        //        return await response.Content.ReadAsStringAsync();
        //    }
    }
}
