import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-eventi',
  standalone: false,
  templateUrl: './eventi.html',
  styleUrl: './eventi.css',
})
export class Eventi {

  events = signal([
    {
      title: 'I Protagonisti del Video',
      date: 'Ogni Weekend',
      description: 'Vieni a conoscere dal vivo i meravigliosi animali esotici che vedi muoversi qui in sottofondo!',
      icon: '›',
      actionText: 'Scopri tutto su questo animale'
    },
    {
      title: 'Safari Esclusivo',
      date: 'Tutti i Giorni',
      description: 'Un tour immersivo e ravvicinato per scoprire i segreti della savana nel nostro habitat.',
      icon: '›'
    }
  ]);

  isAnimalModalOpen = signal(false);

  openAnimalModal(event: Event) {
    event.preventDefault();
    this.isAnimalModalOpen.set(true);
  }

  closeAnimalModal() {
    this.isAnimalModalOpen.set(false);
  }
}
