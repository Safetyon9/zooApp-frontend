import { Component, OnInit, signal } from '@angular/core';
import { EventiServices, EventiDto } from '../../../../../core/services/eventi-services';

@Component({
  selector: 'app-eventi',
  standalone: false,
  templateUrl: './eventi.html',
  styleUrl: './eventi.css',
})
export class Eventi implements OnInit {

  events = signal<(EventiDto & { nonDisponibile?: boolean })[]>([]);
  isAnimalModalOpen = signal(false);

  constructor(private eventiS: EventiServices) {}

  ngOnInit(): void {
    this.eventiS.list().subscribe({
      next: (res) => {
        this.events.set(this.preparaEventi(res || []));
      },
      error: (err) => {
        console.error('Errore caricamento eventi', err);
        this.events.set([]);
      }
    });
  }

  preparaEventi(lista: EventiDto[]): (EventiDto & { nonDisponibile?: boolean })[] {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    const disponibili = lista.filter(event => {
      if (!event.dataInizio) return false;

      const dataFine = event.dataFine ? new Date(event.dataFine) : new Date(event.dataInizio);
      dataFine.setHours(0, 0, 0, 0);

      return dataFine >= oggi;
    });

    const nonDisponibili = lista
      .filter(event => {
        if (!event.dataInizio) return false;

        const dataFine = event.dataFine ? new Date(event.dataFine) : new Date(event.dataInizio);
        dataFine.setHours(0, 0, 0, 0);

        return dataFine < oggi;
      })
      .map(event => ({
        ...event,
        nonDisponibile: true
      }));

    if (disponibili.length >= 2) {
      return disponibili;
    }

    return [...disponibili, ...nonDisponibili].slice(0, 4);
  }

  formattaData(data?: string): string {
    if (!data) return 'Data da definire';

    return new Date(data).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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