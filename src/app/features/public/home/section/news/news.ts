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
      tag: 'Biodiversità',
      title: 'Il cambiamento climatico favorisce gli incendi e mette a rischio sempre più specie',
      date: '8 aprile 2026',
      summary: 'Uno studio pubblicato su Nature Climate Change stima un aumento di area bruciata e stagione degli incendi, con migliaia di specie più vulnerabili.',
      imageUrl: 'https://images.unsplash.com/photo-1612862862126-865765df2ded?auto=format&fit=crop&w=1200&q=80',
      link: 'https://www.corriere.it/animali/biodiversita/26_aprile_08/il-cambiamento-climatico-favorisce-gli-incendi-e-mette-a-rischio-un-numero-sempre-maggiore-di-specie-animali-2bb8bf51-daa7-4302-a9e8-bd2e6c7a0xlk.shtml'
    },
    {
      tag: 'Attualità',
      title: 'Serpenti e coccodrilli per proteggere la frontiera col Bangladesh',
      date: '7 aprile 2026',
      summary: 'L’India valuta l’impiego di rettili nei tratti fluviali vulnerabili per contrastare infiltrazioni illegali, tra dubbi operativi e rischi per i residenti.',
      imageUrl: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=1200&q=80',
      link: 'https://www.corriere.it/animali/26_aprile_07/serpenti-e-coccodrilli-per-proteggere-la-frontiera-cosi-l-india-vuole-contrastare-la-criminalita-4a6fd39d-9f9e-4870-8d97-456905eadxlk.shtml'
    },
    {
      tag: 'Conservazione',
      title: 'Nicaragua libera 845 tartarughe oliva nel Pacifico',
      date: '7 aprile 2026',
      summary: 'Rilasciati 845 piccoli nei rifugi La Flor e Chacocente: l’operazione rientra in un programma di tutela di una specie marina a rischio.',
      imageUrl: 'https://images.unsplash.com/photo-1488441770602-aed21fc49bd5?auto=format&fit=crop&w=1200&q=80',
      link: 'https://www.ansa.it/sito/notizie/mondo/americalatina/2026/04/07/nicaragua-libera-845-tartarughe-oliva-nel-pacifico_c0e11919-3898-4ffa-8ab8-1666965f7d5a.html'
    }
  ]);

}
