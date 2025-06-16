using Microsoft.ML.Data;

namespace air_reservation.Models.Reservation_Model_
{
    public class ReservationMLModel
    {
        [LoadColumn(0)]
        public float UserId { get; set; }

        [LoadColumn(1)]
        [ColumnName("Label")]  // ML.NET expects the output column to be named 'Label'
        public string? Destination { get; set; }
    }
}