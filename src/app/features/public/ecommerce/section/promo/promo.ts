import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.html',
  styleUrl: './promo.css',
  standalone: false,
})
export class Promo implements OnInit, OnDestroy {
  images = [
    'foto/shop1.webp',
    'foto/shop2.webp',
    'foto/shop3.avif',
    'foto/shop4.avif'
  ];
  
  currentIndex = signal<number>(0);
  intervalId: any;

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentIndex.update(index => (index + 1) % this.images.length);
  }

  prevSlide() {
    this.currentIndex.update(index => (index - 1 + this.images.length) % this.images.length);
  }

  setSlide(index: number) {
    this.currentIndex.set(index);
    this.stopCarousel();
    this.startCarousel();
  }
}
