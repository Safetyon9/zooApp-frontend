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
      description: 'Vieni a conoscere dal vivo i meravigliosi animali esotici che vedi in azione qui di fianco!',
      icon: '🐾'
    },
    {
      title: 'Safari Esclusivo',
      date: 'Tutti i Giorni',
      description: 'Un tour immersivo e ravvicinato per scoprire i segreti della savana nel nostro habitat.',
      icon: '🌿'
    }
  ]);
}
