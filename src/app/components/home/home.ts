import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
config: any;
  fullpageApi: any;

  constructor() {
    this.config = {
      anchors: ['intro','donation'],
      scrollOverflow: true,
    };
  }

  getRef(fullPageRef: any) {
    this.fullpageApi = fullPageRef;
  }
}