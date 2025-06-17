


import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { RecommendationService } from '../../../services/recommendation.service';
import { CommonModule } from '@angular/common';
 
@Component({

  selector: 'app-admin-user-recommendations',
  imports:[CommonModule],

  templateUrl: './admin-user-recommendations.component.html',

  styleUrls: ['./admin-user-recommendations.component.css']

})

export class AdminUserRecommendationsComponent implements OnInit {
 
  userId!: number;

  recommendations: any[] = [];

  loading = true;

  getStatusText(status: number): string {
  const statusMapping: { [key: number]: string } = {
    0: "Scheduled",
    1: "Delayed",
    2: "Cancelled",
    3: "Completed",
    4: "Recommended"  // if 4 is recommendation status (or you can map accordingly)
  };
  return statusMapping[status] || "Unknown";
}
 
  constructor(

    private route: ActivatedRoute,

    private recommendationsService: RecommendationService

  ) {}
 
  ngOnInit(): void {

    this.userId = Number(this.route.snapshot.paramMap.get('userId'));

    this.loadRecommendations();

  }
 
  loadRecommendations(): void {

    this.recommendationsService.getUserRecommendations(this.userId).subscribe({

      next: (data) => {
        console.log(data)
        this.recommendations = data;

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

}

 