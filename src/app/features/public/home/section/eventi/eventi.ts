import { Component, OnInit, signal } from '@angular/core';
import { EventiServices, EventoDto } from '../../../../../core/services/eventi-services';

@Component({
  selector: 'app-eventi',
  standalone: false,
  templateUrl: './eventi.html',
  styleUrl: './eventi.css',
})
export class Eventi implements OnInit {

  events = signal<EventoDto[]>([]);
  isAnimalModalOpen = signal(false);

  constructor(private eventiS: EventiServices) {}

  ngOnInit(): void {
    this.eventiS.list().subscribe({
      next: (res) => {
        this.events.set(res || []);
      },
      error: (err) => {
        console.error('Errore caricamento eventi', err);
        this.events.set([]);
      }
    });
  }

  openAnimalModal(event: Event) {
    event.preventDefault();
    this.isAnimalModalOpen.set(true);
  }

  closeAnimalModal() {
    this.isAnimalModalOpen.set(false);
  }
}