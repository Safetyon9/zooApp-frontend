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
    }
  ]);

  videoUrl = 'https://www.youtube.com/embed/iOiBwHe_VRM';
}
