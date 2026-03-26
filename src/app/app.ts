import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class App implements OnDestroy {
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
}