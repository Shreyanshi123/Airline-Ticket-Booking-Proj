import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.css",
})
export class AboutComponent implements OnInit {
  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo(0, 0)
  }
}
