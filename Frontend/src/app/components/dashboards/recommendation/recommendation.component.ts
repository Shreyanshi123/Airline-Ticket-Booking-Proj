import { Component, OnInit } from '@angular/core';
import { RecommendationServiceService } from '../../../services/recommendation-service.service';
import { CommonModule } from '@angular/common';


interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  destination: string;
}

@Component({
  selector: 'app-recommendation',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.css'
})
export class RecommendationComponent implements OnInit {
recommendedFlights: Flight[] = [];

  constructor(private recommendationService: RecommendationServiceService) {}

  ngOnInit(): void {
    const userId = this.getUserId(); // Replace with dynamic user ID
    this.recommendationService.getRecommendations(userId).subscribe(data => {
      this.recommendedFlights = data as any[]; 
    });
  }

  getUserId():number{
    return 2
  }

}
