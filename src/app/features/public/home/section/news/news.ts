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
      tag: 'Conservazione',
      title: 'Nuovo Report: I Crimini di Natura',
      date: 'Marzo 2026',
      summary: 'Il WWF Italia ha pubblicato un nuovo studio globale sul traffico di specie selvatiche e sulla deforestazione, minacce cruciali per la biodiversità.',
      imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80',
      link: 'https://www.wwf.it/'
    },
    {
      tag: 'Scoperte',
      title: 'Leopardi delle nevi in Bhutan',
      date: 'Febbraio 2026',
      summary: 'Grazie alle nuove tecnologie di DNA ambientale (eDNA), i ricercatori hanno individuato rarissimi esemplari in zone finora inesplorate.',
      imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80',
      link: 'https://www.worldwildlife.org/'
    },
    {
      tag: 'Ricerca',
      title: 'I Castori Eroi del Clima',
      date: 'Gennaio 2026',
      summary: 'Un reportage esplora come l\'attività naturale dei castori stia incredibilmente rinfrescando gli ecosistemi e arrestando gli incendi boschivi.',
      imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=80',
      link: 'https://www.nationalgeographic.com/'
    }
  ]);

}
