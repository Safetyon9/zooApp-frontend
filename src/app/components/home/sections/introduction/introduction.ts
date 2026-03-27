import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.html',
  styleUrls: ['./introduction.css'],
  standalone: true
})
export class Introduction implements OnDestroy {

  readonly title = signal('ZooApp');

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
      this.nextImage();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextImage() {
    this.currentImageIndex.update(i => (i + 1) % this.turtleImages.length);
  }

  prevImage() {
    this.currentImageIndex.update(i =>
      (i - 1 + this.turtleImages.length) % this.turtleImages.length
    );
  }
}