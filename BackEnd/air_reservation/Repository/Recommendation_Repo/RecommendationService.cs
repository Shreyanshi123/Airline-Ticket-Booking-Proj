using air_reservation.Data_Access_Layer;
using air_reservation.Models.Reservation_Model_;
using Microsoft.ML;
using Microsoft.ML.Data;
using System.Text;

public class RecommendationService
{
    private readonly MLContext _mlContext;
    private readonly ITransformer? _model;
    private readonly ApplicationDbContext _context;
    private readonly string filePath;

    public RecommendationService(ApplicationDbContext context)
    {
        _context = context;
        _mlContext = new MLContext();
        filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "reservations.csv");

        // Always regenerate full dataset

        if (!File.Exists(filePath) || new FileInfo(filePath).Length == 0)
        {
            Console.WriteLine("CSV file is empty or missing, regenerating...");
            GenerateReservationsCsv();
            //System.Threading.Thread.Sleep(1000);
        }

      

        Console.WriteLine("CSV contents:");
        Console.WriteLine(File.ReadAllText(filePath));

        if (File.Exists(filePath))
        {
            var data = _mlContext.Data.LoadFromTextFile<ReservationMLModel>(filePath, hasHeader: true, separatorChar: ',');
            Console.WriteLine("Verifying loaded data schema:");
            foreach (var col in data.Schema)
            {
                Console.WriteLine($"Column: {col.Name}, Type: {col.Type}");
            }

            var pipeline = _mlContext.Transforms.Conversion.MapValueToKey("Label")  // Destination is now "Label"
     .Append(_mlContext.Transforms.Concatenate("Features", nameof(ReservationMLModel.UserId)))
     .Append(_mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy())
     .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));
            _model = pipeline.Fit(data);


            Console.WriteLine("Verifying dataset schema:");
            foreach (var col in data.Schema)
            {
                Console.WriteLine($"Column: {col.Name}, Type: {col.Type}");
            }

        }
    }

    public void GenerateReservationsCsv()
    {
        var allReservations = _context.Reservations
            .Where(r => r.Flight != null)
            .Select(r => new { r.UserId, r.Flight.Destination })
            .ToList();

        if (!allReservations.Any())
        {
            Console.WriteLine("No reservation data found to train the model.");
            return;
        }

        var csv = new StringBuilder();
        csv.AppendLine("UserId,Destination");

        foreach (var r in allReservations)
        {
            csv.AppendLine($"{r.UserId},{r.Destination}");
        }

        File.WriteAllText(filePath, csv.ToString());
        Console.WriteLine($"CSV generated at: {filePath}");
    }

    public string PredictDestination(int userId)
    {
        if (_model == null)
            return "No model available";

        var predictionEngine = _mlContext.Model.CreatePredictionEngine<ReservationMLModel, DestinationPrediction>(_model);
        var prediction = predictionEngine.Predict(new ReservationMLModel { UserId = userId ,Destination="dummy"});
        return prediction.Destination ?? "No prediction available";
    }
}