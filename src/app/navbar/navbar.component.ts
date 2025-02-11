import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent { 
  onPortfolioClick(): void {
    // Reload + Scroll to top
    window.location.reload();
    window.scrollTo(0, 0);
  }
}

