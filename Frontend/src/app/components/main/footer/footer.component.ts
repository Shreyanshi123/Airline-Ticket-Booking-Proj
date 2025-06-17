import { Component, type OnInit, type OnDestroy, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { Subject } from "rxjs"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.css",
})
export class FooterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  // Component state
  currentYear = new Date().getFullYear()
  isVisible = false
  showScrollTop = false

  // Scroll thresholds
  private scrollThreshold = 300
  private footerVisibilityThreshold = 100

  ngOnInit(): void {
    // Show footer with animation after component loads
    setTimeout(() => {
      this.isVisible = true
    }, 500)

    this.checkScrollPosition()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Listen to scroll events
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(): void {
    this.checkScrollPosition()
  }

  // Listen to resize events for responsive behavior
  @HostListener("window:resize", ["$event"])
  onWindowResize(): void {
    this.checkScrollPosition()
  }

  /**
   * Check scroll position and update component state
   */
  private checkScrollPosition(): void {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Show scroll to top button
    this.showScrollTop = scrollY > this.scrollThreshold

    // Check if footer should be visible (when near bottom of page)
    const distanceFromBottom = documentHeight - (scrollY + windowHeight)
    if (distanceFromBottom < this.footerVisibilityThreshold && !this.isVisible) {
      this.isVisible = true
    }
  }

  /**
   * Smooth scroll to top of page
   */
  scrollToTop(): void {
    const scrollToTop = () => {
      const currentScroll = window.pageYOffset
      if (currentScroll > 0) {
        window.requestAnimationFrame(scrollToTop)
        window.scrollTo(0, currentScroll - currentScroll / 8)
      }
    }
    scrollToTop()
  }

  /**
   * Handle social media link clicks with analytics
   */
  onSocialClick(platform: string): void {
    console.log(`Social media click: ${platform}`)
    // Add analytics tracking here
    // Example: this.analytics.track('social_click', { platform })
  }

  /**
   * Handle footer link clicks with analytics
   */
  onFooterLinkClick(linkName: string): void {
    console.log(`Footer link click: ${linkName}`)
    // Add analytics tracking here
    // Example: this.analytics.track('footer_link_click', { link: linkName })
  }

  /**
   * Get current year for copyright
   */
  getCurrentYear(): number {
    return this.currentYear
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  /**
   * Handle keyboard navigation for accessibility
   */
  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent): void {
    // Handle Enter key on scroll to top button
    if (event.key === "Enter" && event.target === document.querySelector(".scroll-to-top")) {
      this.scrollToTop()
    }
  }
}
