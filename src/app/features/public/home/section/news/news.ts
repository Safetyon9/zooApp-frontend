import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-news',
  standalone: false,
  templateUrl: './news.html',
  styleUrl: './news.css',
})
export class News {

  newsList = signal([
    {
      title: 'Nato un cucciolo di giraffa!',
      date: '2 Aprile 2026',
      summary: 'Il nostro zoo dà il benvenuto ad un nuovo cucciolo di giraffa. Vieni a conoscerlo!',
      tag: 'Nascite'
    },
    {
      title: 'Nuovo habitat per i pinguini',
      date: '28 Marzo 2026',
      summary: 'Inaugurata la nuova area artica con un habitat ampliato per i pinguini imperatore.',
      tag: 'Novità'
    },
    {
      title: 'Orari estivi aggiornati',
      date: '20 Marzo 2026',
      summary: 'Da aprile lo zoo sarà aperto fino alle 20:00. Approfitta delle giornate più lunghe!',
      tag: 'Info'
    },
    {
      title: 'Programma di conservazione',
      date: '10 Marzo 2026',
      summary: 'Abbiamo aderito al programma europeo per la conservazione del lupo appenninico.',
      tag: 'Conservazione'
    }
  ]);
}
