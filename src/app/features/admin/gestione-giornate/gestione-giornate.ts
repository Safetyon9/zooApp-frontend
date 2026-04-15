import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GiornateServices, GiornateDto } from '../../../core/services/giornate-services';
import { EventiServices, EventiDto } from '../../../core/services/eventi-services';

@Component({
  selector: 'gestione-giornate',
  templateUrl: './gestione-giornate.html',
  styleUrls: ['./gestione-giornate.css'],
  standalone: false
})
export class GestioneGiornate implements OnInit {
  currentDate = new Date();
  days: any[] = [];
  selectedDate: GiornateDto | null = null;
  
  monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  constructor(
    public giornateS: GiornateServices,
    public eventiS: EventiServices
  ) { }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    forkJoin([
      this.eventiS.list(),
      this.giornateS.list()
    ]).subscribe({
      next: () => this.generateCalendar(),
      error: (err) => {
        console.error('Errore caricamento dati calendario:', err);
        this.generateCalendar();
      }
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    this.days = [];

    for (let i = firstDay; i > 0; i--) {
      this.days.push({
        day: prevMonthLastDay - i + 1,
        currentMonth: false,
        date: null
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const backendGiornate = this.giornateS.giornate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = this.formatDate(date);
      const gInfo = backendGiornate.find(g => g.data.startsWith(dateStr));

      this.days.push({
        day: i,
        currentMonth: true,
        date: dateStr,
        isToday: date.getTime() === today.getTime(),
        info: gInfo ? { ...gInfo } : { data: dateStr, stock: 0, aperto: false }
      });
    }

    const remaining = 42 - this.days.length;
    for (let i = 1; i <= remaining; i++) {
      this.days.push({
        day: i,
        currentMonth: false,
        date: null
      });
    }
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  selectDay(day: any) {
    if (!day.currentMonth) return;
    this.selectedDate = { ...day.info };
  }

  compareEventi(e1: any, e2: any): boolean {
    return (e1?.id === e2?.id) || (e1 === e2);
  }

  onEventChange(evento: any) {
    if (!this.selectedDate) return;
    if (!evento) {
      this.selectedDate.aperto = true;
    }
  }

  saveStock() {
    if (!this.selectedDate) return;

    const payload: GiornateDto = {
      ...this.selectedDate,
      eventoId: this.selectedDate.eventoId?.id
        ? this.selectedDate.eventoId
        : undefined
    };

    const action = payload.id
      ? this.giornateS.update(payload)
      : this.giornateS.create(payload);

    action.subscribe({
      next: () => {
        this.refreshData();
        this.selectedDate = null;
      },
      error: (err) => console.error('Errore salvataggio giornata:', err)
    });
  }

    cancelEdit() {
      this.selectedDate = null;
    }
  }

