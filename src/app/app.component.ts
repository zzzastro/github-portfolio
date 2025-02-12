import { Component, AfterViewInit, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ParticlesBackgroundComponent } from './particles-background/particles-background.component';

interface Project {
  title: string;
  description: string;
  media: { type: 'image' | 'video'; src: string };
  link: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ParticlesBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'portfolio-self';


  projects: Project[] = [
    {
      title: 'CiteCat',
      description: 'Django-based web app to detect content similarity using Pythons PyTorch library.',
      media: { type: 'video', src: 'assets/projects/project1.mp4' },
      link: ''
    },
    {
      title: 'Noteapp',
      description: 'A simple notes application for creating and managing notes.',
      media: { type: 'video', src: 'assets/projects/project2.mp4' },
      link: 'https://github.com/zzzastro/Noteapp'
    },
    {
      title: 'Storefront',
      description: 'A ecommerce project with a shopping cart, product listing, and checkout functionality.',
      media: { type: 'video', src: 'assets/projects/project3.mp4' },
      link: ''
    },
    {
      title: 'PDF Annotator',
      description: 'Tool that provides users with annotation capabilities to PDF documents.',
      media: { type: 'image', src: 'assets/projects/project.jpg' },
      link: ''
    },
    {
      title: 'Personal Portfolio',
      description: 'A personal portfolio project to showcase my information, skills, and projects.',
      media: { type: 'image', src: 'assets/projects/portfolio-project.png' },
      link: 'https://github.com/zzzastro/github-portfolio'
    },

  ];

  private navLinkUnlisteners: (() => void)[] = [];

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // Remove URL fragment (if any) on initial load and scroll to the top
    if (window.location.hash) {
      const cleanUrl = window.location.href.split('#')[0];
      window.history.replaceState({}, document.title, cleanUrl);
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit(): void {
    // Ensure page is scrolled to the top after view initialization
    setTimeout(() => {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }, 100);

    // Attach click event listeners to navigation links using Renderer2
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      // Skip any link that should be handled by its own component (portfolio link)
      if ((link as HTMLElement).classList.contains('portfolio-link')) {
        return;
      }
      const unlisten = this.renderer.listen(link, 'click', (event: Event) => {
        event.preventDefault();
        const targetId = (link as HTMLAnchorElement).getAttribute('href');
        if (targetId === '#' || targetId === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (targetId) {
          const targetSection = document.querySelector(targetId) as HTMLElement;
          if (targetSection) {
            // Reset and trigger the bounce animation
            targetSection.classList.remove('bounce-animation');
            void targetSection.offsetWidth; // Force reflow to restart animation
            targetSection.classList.add('bounce-animation');
            // Smooth scroll to the target section
            targetSection.scrollIntoView({ behavior: 'smooth' });
            targetSection.addEventListener('animationend', () => {
              targetSection.classList.remove('bounce-animation');
            }, { once: true });
          }
        }
      });
      this.navLinkUnlisteners.push(unlisten);
    });

    // Dispatch a resize event after a delay to recalculate particle background dimensions
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }

  ngOnDestroy(): void {
    // Remove attached event listeners to avoid memory leaks
    this.navLinkUnlisteners.forEach(unlisten => unlisten());
  }

  contactEmail(): void {
    const email = 'ashish.bhatt.app@gmail.com';
    const subject = 'Regarding Your Portfolio';
    window.open(`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${email}&su=${encodeURIComponent(subject)}`, '_blank');
  }

  // Handle Missing Media Errors by providing fallback content
  handleMediaError(event: Event) {
    const target = event.target as HTMLImageElement | HTMLVideoElement;

    if (target instanceof HTMLImageElement) {
      target.src = 'assets/fallback-image.png'; // Fallback for images
    } else if (target instanceof HTMLVideoElement) {
      // Fallback for video: set poster image and hide video element
      target.setAttribute('poster', 'assets/fallback-image.png'); // Set poster image as fallback
      target.style.display = 'none'; // Hide the video itself

      // Create and append a fallback image element
      const fallbackImage = document.createElement('img');
      fallbackImage.src = 'assets/fallback-image.png';
      fallbackImage.alt = 'Video not available';
      fallbackImage.classList.add('fallback-media');
      target.parentElement?.appendChild(fallbackImage);
    }
  }

}


