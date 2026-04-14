import { Component, OnInit, signal } from '@angular/core';
import { EventiServices, EventiDto } from '../../../../../core/services/eventi-services';

type EventoView = EventiDto & {
  nonDisponibile?: boolean;
  inCorso?: boolean;
};

@Component({
  selector: 'app-eventi',
  standalone: false,
  templateUrl: './eventi.html',
  styleUrl: './eventi.css',
})
export class Eventi implements OnInit {

  events = signal<EventoView[]>([]);
  isModalOpen = signal(false);

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

  preparaEventi(lista: EventiDto[]): EventoView[] {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    const eventiProcessati: EventoView[] = lista
      .filter(event => !!event.dataInizio)
      .map(event => {
        const dataInizio = new Date(event.dataInizio!);
        dataInizio.setHours(0, 0, 0, 0);

        const dataFine = event.dataFine ? new Date(event.dataFine) : new Date(event.dataInizio!);
        dataFine.setHours(0, 0, 0, 0);

        const inCorso = dataInizio <= oggi && dataFine >= oggi;
        const nonDisponibile = dataFine < oggi;

        return {
          ...event,
          inCorso,
          nonDisponibile
        };
      });

    eventiProcessati.sort((a, b) => {
      const aStart = new Date(a.dataInizio!).getTime();
      const bStart = new Date(b.dataInizio!).getTime();

      if (a.inCorso && !b.inCorso) return -1;
      if (!a.inCorso && b.inCorso) return 1;

      if (!a.nonDisponibile && b.nonDisponibile) return -1;
      if (a.nonDisponibile && !b.nonDisponibile) return 1;

      return aStart - bStart;
    });

    return eventiProcessati;
  }

  get featuredEvents(): EventoView[] {
    return this.events().slice(0, 2);
  }

  get remainingEvents(): EventoView[] {
    return this.events().slice(2);
  }

  formattaData(data?: string): string {
    if (!data) return 'Data da definire';

    return new Date(data).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
