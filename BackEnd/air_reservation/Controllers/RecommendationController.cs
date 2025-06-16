using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class RecommendationController : ControllerBase
{
    private readonly RecommendationService _recommendationService;

    public RecommendationController(RecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }

    [HttpGet("ml-recommendation/{userId}")]
    public IActionResult GetMLRecommendation(int userId)
    {
        var recommendedDestination = _recommendationService.PredictDestination(userId);
        return Ok(recommendedDestination);
    }
}