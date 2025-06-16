using Microsoft.ML.Data;

namespace air_reservation.Models.Reservation_Model_
{
    public class DestinationPrediction
    {
        [ColumnName("PredictedLabel")]
        public string? Destination { get; set; }
    }
}