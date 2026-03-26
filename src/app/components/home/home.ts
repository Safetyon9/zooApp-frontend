// home.ts
import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy{

    protected readonly title = signal('zooApp-frontend');
  
  turtleImages = [
    'foto/animal1.jpg',
    'foto/animal2.jpg',
    'foto/animal3.jpg',
    'foto/animal4.jpg'
  ];
  currentImageIndex = signal(0);

  private intervalId: any;

  constructor() {
    this.startCarousel();
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex.update(index => (index + 1) % this.turtleImages.length);
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

    nextImage() {
  this.currentImageIndex.update(index => (index + 1) % this.turtleImages.length);
}

prevImage() {
  this.currentImageIndex.update(index => 
    (index - 1 + this.turtleImages.length) % this.turtleImages.length
  );
  }
}