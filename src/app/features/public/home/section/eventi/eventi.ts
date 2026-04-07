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
      title: 'Safari Notturno',
      date: '20 Aprile 2026',
      description: 'Esplora lo zoo di notte e scopri gli animali notturni in azione.',
      icon: '🌙'
    },
    {
      title: 'Giornata dei Cuccioli',
      date: '5 Maggio 2026',
      description: 'Vieni a conoscere i nuovi nati del nostro zoo!',
      icon: '🐣'
    },
    {
      title: 'Laboratorio per Bambini',
      date: '15 Maggio 2026',
      description: 'Attività educative e giochi a tema animali per i più piccoli.',
      icon: '🎨'
    },
    {
      title: 'Feeding Time Show',
      date: '25 Maggio 2026',
      description: 'Assisti dal vivo al momento del pasto dei nostri animali.',
      icon: '🦁'
    }
  ]);
}
