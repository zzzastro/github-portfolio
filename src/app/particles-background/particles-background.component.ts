import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input, NgZone } from '@angular/core';

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

interface MousePosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-particles-background',
  template: `
    <div #containerRef class="particles-container">
      <canvas #canvasRef></canvas>
      <ng-content></ng-content>
    </div>
  `,
})
export class ParticlesBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;
  @Input() quantity: number = 100;
  @Input() staticity: number = 50;
  @Input() ease: number = 50;
  @Input() color: string = '#ffffff';
  @Input() particleSize: number = 0.4;
  @Input() vx: number = 0;
  @Input() vy: number = 0;

  private context: CanvasRenderingContext2D | null = null;
  private circles: Circle[] = [];
  private mousePosition: MousePosition = { x: 0, y: 0 };
  private mouse = { x: 0, y: 0 };
  private canvasSize = { w: 0, h: 0 };
  private dpr: number = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  private animationFrameId: number | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.setupMouseListeners();
  }

  ngAfterViewInit() {
    this.context = this.canvasRef.nativeElement.getContext('2d');
    this.initCanvas();
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
    window.addEventListener('resize', () => this.initCanvas());
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', () => this.initCanvas());
  }

  private setupMouseListeners() {
    window.addEventListener('mousemove', (event) => {
      this.handleMouseMove(event);
    });
  }

  private handleMouseMove(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left - this.canvasSize.w / 2;
    const y = event.clientY - rect.top - this.canvasSize.h / 2;
    const inside = x < this.canvasSize.w / 2 && x > -this.canvasSize.w / 2 && 
                  y < this.canvasSize.h / 2 && y > -this.canvasSize.h / 2;
    if (inside) {
      this.mouse.x = x;
      this.mouse.y = y;
    }
  }

  private initCanvas() {
    this.resizeCanvas();
    this.drawParticles();
  }

  private resizeCanvas() {
    const container = this.containerRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    this.circles = [];
    this.canvasSize.w = container.offsetWidth;
    this.canvasSize.h = container.offsetHeight;
    canvas.width = this.canvasSize.w * this.dpr;
    canvas.height = this.canvasSize.h * this.dpr;
    canvas.style.width = `${this.canvasSize.w}px`;
    canvas.style.height = `${this.canvasSize.h}px`;
    this.context?.scale(this.dpr, this.dpr);
  }

  private hexToRgb(hex: string): number[] {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const hexInt = parseInt(hex, 16);
    return [
      (hexInt >> 16) & 255,
      (hexInt >> 8) & 255,
      hexInt & 255
    ];
  }

  private circleParams(): Circle {
    return {
      x: Math.floor(Math.random() * this.canvasSize.w),
      y: Math.floor(Math.random() * this.canvasSize.h),
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + this.particleSize,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4
    };
  }

  private drawCircle(circle: Circle, update = false) {
    if (!this.context) return;
    
    const rgb = this.hexToRgb(this.color);
    const { x, y, translateX, translateY, size, alpha } = circle;
    
    this.context.translate(translateX, translateY);
    this.context.beginPath();
    this.context.arc(x, y, size, 0, 2 * Math.PI);
    this.context.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`;
    this.context.fill();
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    if (!update) {
      this.circles.push(circle);
    }
  }

  private remapValue(value: number, start1: number, end1: number, start2: number, end2: number): number {
    const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  }

  private drawParticles() {
    this.context?.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    for (let i = 0; i < this.quantity; i++) {
      const circle = this.circleParams();
      this.drawCircle(circle);
    }
  }

  private animate = () => {
    this.context?.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    
    this.circles.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        this.canvasSize.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        this.canvasSize.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));

      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }

      circle.x += circle.dx + this.vx;
      circle.y += circle.dy + this.vy;
      circle.translateX += (this.mouse.x / (this.staticity / circle.magnetism) - circle.translateX) / this.ease;
      circle.translateY += (this.mouse.y / (this.staticity / circle.magnetism) - circle.translateY) / this.ease;

      this.drawCircle(circle, true);

      if (circle.x < -circle.size || 
          circle.x > this.canvasSize.w + circle.size || 
          circle.y < -circle.size || 
          circle.y > this.canvasSize.h + circle.size) {
        this.circles.splice(i, 1);
        const newCircle = this.circleParams();
        this.drawCircle(newCircle);
      }
    });

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}