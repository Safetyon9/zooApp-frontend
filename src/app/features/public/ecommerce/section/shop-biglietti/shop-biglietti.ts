import { Component, OnInit, signal } from '@angular/core';
import { ItemsServices } from '../../../../../core/services/items-services';
import { ShopService } from '../../../../../core/services/shop-services';
import { GiornateServices, GiornateDto } from '../../../../../core/services/giornate-services';
import { EventiServices, EventiDto } from '../../../../../core/services/eventi-services';

@Component({
  selector: 'app-shop-biglietti',
  templateUrl: './shop-biglietti.html',
  styleUrl: './shop-biglietti.css',
  standalone: false,
})
export class ShopBiglietti implements OnInit {

  quantity = 1;
  selectedDate: GiornateDto | null = null;
  imgBaseUrl = "http://localhost:9090/files/";

  currentDate = new Date();
  days: any[] = [];
  monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  constructor(
    private itemsS: ItemsServices,
    public shop: ShopService,
    private giornateS: GiornateServices,
    private eventiS: EventiServices
  ) {}

  ngOnInit(): void {
    this.itemsS.list('biglietti').subscribe({
      error: err => console.error('Errore caricamento biglietti', err)
    });
    this.eventiS.list().subscribe();
    this.loadGiornate();
    this.generateCalendar();
  }

  loadGiornate() {
    this.giornateS.list().subscribe({
        next: () => this.generateCalendar(),
        error: (err) => {
            console.error('Errore caricamento giornate', err);
            this.generateCalendar();
        }
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    this.days = [];
    
    for (let i = firstDay; i > 0; i--) {
        this.days.push({ 
            day: prevMonthDays - i + 1, 
            currentMonth: false,
            date: null
        });
    }
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const backendGiornate = this.giornateS.giornate();
    const allEventi = this.eventiS.eventi();

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateStr = this.formatDate(date);
        
        const gInfo = backendGiornate.find(g => g.data.startsWith(dateStr));
        


        this.days.push({
            day: i,
            currentMonth: true,
            date: dateStr,
            isToday: date.getTime() === today.getTime(),
            isPast: date < today,
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
    this.generateCalendar();
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
    this.generateCalendar();
  }

  selectDay(day: any) {
    if (!day.currentMonth || day.isPast || !day.info?.aperto) return;
    this.selectedDate = day.info;
  }

  get biglietti() {
    return this.itemsS.biglietti();
  }

  animalThumbnails = [
    'foto/animali/leone.jpg',
    'foto/animali/tigre.jpg',
    'foto/animali/giraffa.jpg',
    'foto/animali/elefante.jpg'
  ];

  getTicketImage(ticket: any): string {
    if (ticket.urlImmagine) return this.imgBaseUrl + ticket.urlImmagine;
    const index = (ticket.id || 0) % this.animalThumbnails.length;
    return this.animalThumbnails[index];
  }

  addToCart(ticket: any) {
    if (!this.selectedDate) {
      alert('Per favore seleziona una data disponibile dal calendario.');
      return;
    }
    
    this.shop.addToCart(
      ticket,
      'biglietto',
      this.quantity,
      {
        date: this.selectedDate.data
      }
    );
  }
}