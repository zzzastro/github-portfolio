import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-sakura-blossom',
  templateUrl: './sakura-blossom.component.html',
  styleUrls: ['./sakura-blossom.component.css']
})
export class SakuraBlossomComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sakuraContainer', { static: false }) sakuraContainer!: ElementRef;
  private petalInterval: any;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.createInitialPetals();
    this.startPetalFall();
  }

  ngOnDestroy(): void {
    this.stopPetalFall();
  }

  private createInitialPetals(): void {
    this.createPetals(30); // Initial burst of petals
  }

  private startPetalFall(): void {
    this.petalInterval = setInterval(() => this.createPetals(10), 3000);
  }

  private stopPetalFall(): void {
    if (this.petalInterval) {
      clearInterval(this.petalInterval);
    }
  }

  private createPetals(count: number): void {
    const container = this.sakuraContainer.nativeElement;
    
    for (let i = 0; i < count; i++) {
      const petal = this.renderer.createElement('div');
      this.renderer.addClass(petal, 'sakura-petal');
      
      const startLeft = Math.random() * 100;
      const animationDuration = 8 + Math.random() * 8;
      const animationDelay = Math.random() * -5;
      const size = 15 + Math.random() * 15;

      this.renderer.setStyle(petal, 'left', `${startLeft}%`);
      this.renderer.setStyle(petal, 'width', `${size}px`);
      this.renderer.setStyle(petal, 'height', `${size}px`);
      this.renderer.setStyle(petal, 'height', `${size}px`);
      this.renderer.setStyle(petal, 'animation', 
        `fall ${animationDuration}s linear ${animationDelay}s infinite, 
         sway 4s ease-in-out ${animationDelay}s infinite,
         fadeOut ${animationDuration}s ease-in ${animationDelay}s infinite`);

      this.renderer.appendChild(container, petal);

      // Auto-remove petals after animation
      setTimeout(() => {
        if (petal.parentElement) {
          this.renderer.removeChild(container, petal);
        }
      }, (animationDuration + 2) * 1000);
    }
  }
}