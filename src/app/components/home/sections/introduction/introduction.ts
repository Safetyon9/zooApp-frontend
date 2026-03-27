import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './introduction.html',
  styleUrls: ['./introduction.css'],
})
export class Introduction implements OnDestroy {

  readonly title = signal('ZooApp');

  animalImages = [
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
    this.intervalId = setInterval(() => this.nextImage(), 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  nextImage() {
    this.currentImageIndex.update(i => (i + 1) % this.animalImages.length);
  }

  prevImage() {
    this.currentImageIndex.update(i => (i - 1 + this.animalImages.length) % this.animalImages.length);
  }
}