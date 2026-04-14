import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.html',
  styleUrl: './donation.css',
  standalone: false,
})
export class Donation implements OnDestroy {
  selectedAmount = signal<number>(10);
  customAmount: number | null = null;
  isProcessing = signal<boolean>(false);
  donationSuccess = signal<boolean>(false);
  donatedAmount = signal<number>(0);

  animalImages = [
    'foto/donation/donation1.jpg',
    'foto/donation/donation2.jpg',
    'foto/donation/donation3.jpg',
    'foto/donation/donation4.jpg'
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

  selectAmount(amount: number) {
    this.selectedAmount.set(amount);
    if (amount !== 0) {
      this.customAmount = null;
    }
  }

  processDonation() {
    const amount = this.selectedAmount() || this.customAmount;
    if (!amount) return;

    this.isProcessing.set(true);

    setTimeout(() => {
      this.donatedAmount.set(Number(amount));
      this.isProcessing.set(false);
      this.donationSuccess.set(true);

      setTimeout(() => {
        this.donationSuccess.set(false);
        this.selectedAmount.set(10);
        this.customAmount = null;
      }, 4000);
    }, 1500);
  }
}
