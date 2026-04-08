import { Component, OnInit } from '@angular/core';
import { ProdottiServices } from '../../../../core/services/prodotti-services';
import { Utilities } from '../../../../core/utils/utilities';

@Component({
  selector: 'app-merch',
  standalone: false,
  templateUrl: './merch.html',
  styleUrls: ['./merch.css']
  
})
export class Merch implements OnInit {
  
  merchList: any[] = [];
  categoria: any = null;
  colore: any = null;
  taglia: any = null;
  prezzoMin: number | null = null;
  prezzoMax: number | null = null;

  categoriaList: any[] = [];
  coloreList: any[] = [];
  taglieList: any[] = [];

  merchCreate: any = null;

  constructor(
    private merchS: ProdottiServices,
    private util: Utilities
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}