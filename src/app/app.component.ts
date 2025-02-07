import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SakuraBlossomComponent } from './sakura-blossom/sakura-blossom.component';
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
export class AppComponent implements AfterViewInit, OnInit {

  ngOnInit(): void {
    // Remove fragment from URL
    if (window.location.hash) {
      const cleanUrl = window.location.href.split('#')[0];
      window.history.replaceState({}, document.title, cleanUrl);
      window.scrollTo(0, 0);
    }
  }

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
      media: { type: 'image', src: 'assets/projects/project3.jpg' },
      link: ''
    },

  ];

  contactEmail() {
    const email = 'ashish.bhatt.app@gmail.com';
    const subject = 'Regarding Your Portfolio';
    window.open(`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${email}&su=${encodeURIComponent(subject)}`, '_blank');
  }

  // Handle Missing Media Errors
  handleMediaError(event: Event) {
    const target = event.target as HTMLImageElement | HTMLVideoElement;
  
    if (target instanceof HTMLImageElement) {
      target.src = 'assets/fallback-image.png'; // Fallback for images
    } else if (target instanceof HTMLVideoElement) {
      // Fallback for video
      target.setAttribute('poster', 'assets/fallback-image.png'); // Set poster image as fallback
      target.style.display = 'none'; // Hide the video itself
  
      // Create a fallback image element
      const fallbackImage = document.createElement('img');
      fallbackImage.src = 'assets/fallback-image.png';
      fallbackImage.alt = 'Video not available';
  
      // Apply CSS class for styling (this should apply the styles from the CSS file)
      fallbackImage.classList.add('fallback-media');
  
      // Check if the class is properly applied (for debugging)
      console.log(fallbackImage.classList); // Debugging log
  
      // Insert the fallback image inside the video container
      target.parentElement?.appendChild(fallbackImage); 
    }
  }
  
  
  

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }, 100);

    const navLinks = document.querySelectorAll('.nav-center a');

    navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        const targetId = link.getAttribute('href');
        if (targetId) {
          const targetSection = document.querySelector(targetId) as HTMLElement;
          if (targetSection) {
            // Remove the bounce-animation class to reset the animation
            targetSection.classList.remove('bounce-animation');

            // Force reflow to allow the browser to register the removal
            void targetSection.offsetWidth; // Trigger reflow

            // Add the bounce-animation class to trigger the bounce effect
            targetSection.classList.add('bounce-animation');

            // Scroll to the target section immediately
            targetSection.scrollIntoView({ behavior: 'smooth' });

            // Remove the class after the animation ends
            targetSection.addEventListener('animationend', () => {
              targetSection.classList.remove('bounce-animation');
            }, { once: true }); // Ensure the listener is removed after execution
          }
        }
      });
    });
  }

}
